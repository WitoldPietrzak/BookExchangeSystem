package org.bs.bookshare.exceptions;

import static org.bs.bookshare.common.Codes.ACTION_NOT_ALLOWED;
import static org.bs.bookshare.common.Codes.INCORRECT_PASSWORD;
import static org.bs.bookshare.common.Codes.INVALID_MAIL;
import static org.bs.bookshare.common.Codes.LANGUAGE_ALREADY_IN_USE;
import static org.bs.bookshare.common.Codes.LOGIN_EXIST;
import static org.bs.bookshare.common.Codes.MAIL_EXIST;
import static org.bs.bookshare.common.Codes.PASSWORDS_NOT_MATCH;
import static org.bs.bookshare.common.Codes.PASSWORD_ALREADY_RESET;
import static org.bs.bookshare.common.Codes.PASSWORD_IN_USE;
import static org.bs.bookshare.common.Codes.ROLE_EXIST;
import static org.bs.bookshare.common.Codes.ROLE_NOT_EXIST;
import static org.bs.bookshare.common.Codes.ROLE_NOT_FOUND;
import static org.bs.bookshare.common.Codes.UNKNOWN_LANGUAGE;
import static org.bs.bookshare.common.Codes.USER_ALREADY_ACTIVATED;
import static org.bs.bookshare.common.Codes.USER_DISABLED;
import static org.bs.bookshare.common.Codes.USER_NOT_DISABLED;
import static org.bs.bookshare.common.Codes.USER_NOT_FOUND;

public class AppUserException extends AppBaseException {

    private AppUserException(String message) {
        super(message);
    }

    private AppUserException(String message, Throwable cause) {
        super(message, cause);
    }

    public static AppUserException loginExists() {
        return new AppUserException(LOGIN_EXIST);
    }

    public static AppUserException emailExists() {
        return new AppUserException(MAIL_EXIST);
    }

    public static AppUserException emailInvalid() {
        return new AppUserException(INVALID_MAIL);
    }

    public static AppUserException userNotFound() {
        return new AppUserException(USER_NOT_FOUND);
    }

    public static AppUserException passwordsDontMatch() {
        return new AppUserException(PASSWORDS_NOT_MATCH);
    }

    public static AppUserException IncorrectPassword() {
        return new AppUserException(INCORRECT_PASSWORD);
    }

    public static AppUserException passwordUsed() {
        return new AppUserException(PASSWORD_IN_USE);
    }

    public static AppUserException roleExists() {
        return new AppUserException(ROLE_EXIST);
    }

    public static AppUserException roleDoesntExists() {
        return new AppUserException(ROLE_NOT_EXIST);
    }

    public static AppUserException roleNotFound() {
        return new AppUserException(ROLE_NOT_FOUND);
    }

    public static AppUserException unknownLanguage() {
        return new AppUserException(UNKNOWN_LANGUAGE);
    }

    public static AppUserException userDisabled() {
        return new AppUserException(USER_DISABLED);
    }

    public static AppUserException userNotDisabled() {
        return new AppUserException(USER_NOT_DISABLED);
    }

    public static AppUserException actionNotAllowed() {
        return new AppUserException(ACTION_NOT_ALLOWED);
    }

    public static AppUserException languageAlreadyInUse() {
        return new AppUserException(LANGUAGE_ALREADY_IN_USE);
    }

    public static AppUserException alreadyActivated() {
        return new AppUserException(USER_ALREADY_ACTIVATED);
    }

    public static AppUserException alreadyReset() {
        return new AppUserException(PASSWORD_ALREADY_RESET);
    }
}
