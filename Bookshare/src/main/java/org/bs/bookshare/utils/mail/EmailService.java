package org.bs.bookshare.utils.mail;

public interface EmailService
{
    public void sendMail(String to, String subject, String from, String message);
}
