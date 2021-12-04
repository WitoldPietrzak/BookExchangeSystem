package org.bs.bookshare.exceptions;

public class AppUserException extends AppBaseException {

    private AppUserException(String message) {
        super(message);
    }

    private AppUserException(String message, Throwable cause) {
        super(message, cause);
    }

    public static AppUserException loginExists(){
        return new AppUserException("LOGIN_EXIST");//TODO
    }

    public static AppUserException emailExists(){
        return new AppUserException("MAIL_EXIST");//TODO
    }

    public static AppUserException emailInvalid(){
        return new AppUserException("INVALID_MAIL");//TODO
    }

    public static AppUserException userNotFound() {
        return new AppUserException("USER_NOT_FOUND");
    }

    public static AppUserException passwordsDontMatch() {
        return new AppUserException("PASSWORDS_NOT_MATCH");
    }

    public static AppUserException IncorrectPassword() {
        return new AppUserException("INCORRECT_PASSWORD");
    }

    public static AppUserException passwordUsed() {return new AppUserException("PASSWORD_USED");
    }
    public static AppUserException roleExists() {
        return new AppUserException("ROLE_EXIST");
    }

    public static AppUserException roleDoesntExists() {
        return new AppUserException("ROLE_NOT_EXIST");
    }

    public static AppUserException roleNotFound() {
        return new AppUserException("ROLE_NOT_FOUND");
    }
}
