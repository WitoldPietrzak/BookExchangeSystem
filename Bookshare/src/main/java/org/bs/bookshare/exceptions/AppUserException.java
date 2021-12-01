package org.bs.bookshare.exceptions;

public class AppUserException extends AppBaseException {

    private AppUserException(String message) {
        super(message);
    }

    private AppUserException(String message, Throwable cause) {
        super(message, cause);
    }

    public static AppUserException loginExists(){
        return new AppUserException("Login istnieje");//TODO
    }

    public static AppUserException emailExists(){
        return new AppUserException("Email istnieje");//TODO
    }

    public static AppUserException emailInvalid(){
        return new AppUserException("Nieprawidłowy email");//TODO
    }
}
