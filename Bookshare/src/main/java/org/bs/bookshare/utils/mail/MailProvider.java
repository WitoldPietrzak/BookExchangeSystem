package org.bs.bookshare.utils.mail;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Properties;
import java.util.ResourceBundle;

import static org.bs.bookshare.common.Codes.ACCOUNT_ENABLE_MAIL_SUBJECT;
import static org.bs.bookshare.common.Codes.ACCOUNT_ENABLE_MAIL_TEXT;
import static org.bs.bookshare.common.Codes.ACTIVATION_MAIL_SUBJECT;
import static org.bs.bookshare.common.Codes.ACTIVATION_MAIL_TEXT;
import static org.bs.bookshare.common.Codes.ADMIN_ACCOUNT_LOGIN_MAIL_SUBJECT;
import static org.bs.bookshare.common.Codes.ADMIN_ACCOUNT_LOGIN_MAIL_TEXT;
import static org.bs.bookshare.common.Codes.PASSWORD_RESET_MAIL_SUBJECT;
import static org.bs.bookshare.common.Codes.PASSWORD_RESET_MAIL_TEXT;


@Component
@RequiredArgsConstructor
public class MailProvider {
    @Autowired
    EmailService emailService;
    @Autowired
    Environment environment;

    public void sendActivationMail(String to, String token, String lang) {
        Locale locale = new Locale(lang);
        StringBuilder stringBuilder = new StringBuilder();
        String activationLink = String.format(stringBuilder.append(environment.getProperty("frontend_address_base")).append(environment.getProperty("frontend_activation_path")).toString(), token);
        ResourceBundle langBundle = ResourceBundle.getBundle("LanguageRes", locale);
        String subject = langBundle.getString(ACTIVATION_MAIL_SUBJECT);
        String from = environment.getProperty("spring.mail.username");
        String message = String.format(langBundle.getString(ACTIVATION_MAIL_TEXT), activationLink);
        emailService.sendMail(to, subject, from, message);
    }

    public void sendPasswordResetMail(String to, String token, String lang) {
        Locale locale = new Locale(lang);
        StringBuilder stringBuilder = new StringBuilder();
        String activationLink = String.format(stringBuilder.append(environment.getProperty("frontend_address_base")).append(environment.getProperty("frontend_reset_path")).toString(), token);
        ResourceBundle langBundle = ResourceBundle.getBundle("LanguageRes", locale);
        String subject = langBundle.getString(PASSWORD_RESET_MAIL_SUBJECT);
        String from = environment.getProperty("spring.mail.username");
        String message = String.format(langBundle.getString(PASSWORD_RESET_MAIL_TEXT), activationLink);
        emailService.sendMail(to, subject, from, message);
    }

    public void sendAccountEnableMail(String to, String token, String lang) {
        Locale locale = new Locale(lang);
        StringBuilder stringBuilder = new StringBuilder();
        String activationLink = String.format(stringBuilder.append(environment.getProperty("frontend_address_base")).append(environment.getProperty("frontend_enable_path")).toString(), token);
        ResourceBundle langBundle = ResourceBundle.getBundle("LanguageRes", locale);
        String subject = langBundle.getString(ACCOUNT_ENABLE_MAIL_SUBJECT);
        String from = environment.getProperty("spring.mail.username");
        String message = String.format(langBundle.getString(ACCOUNT_ENABLE_MAIL_TEXT), activationLink);
        emailService.sendMail(to, subject, from, message);
    }

    public void sendAdminLoginAttemptMail(String to, String ip, String lang) {
        Locale locale = new Locale(lang);
        ResourceBundle langBundle = ResourceBundle.getBundle("LanguageRes", locale);
        String subject = langBundle.getString(ADMIN_ACCOUNT_LOGIN_MAIL_SUBJECT);
        String from = environment.getProperty("spring.mail.username");
        String message = String.format(langBundle.getString(ADMIN_ACCOUNT_LOGIN_MAIL_TEXT), ip);
        emailService.sendMail(to, subject, from, message);
    }
}
