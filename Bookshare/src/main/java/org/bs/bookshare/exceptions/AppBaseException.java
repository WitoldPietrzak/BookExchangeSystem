package org.bs.bookshare.exceptions;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import static org.bs.bookshare.common.Codes.ACCESS_DENIED;


public class AppBaseException extends Exception{
    protected AppBaseException(String message) {
        super(message);
    }
    protected AppBaseException(String message, Throwable cause) {
        super(message, cause);
    }
    public AppBaseException accessDeniedException(){return new AppBaseException(ACCESS_DENIED);}
}
