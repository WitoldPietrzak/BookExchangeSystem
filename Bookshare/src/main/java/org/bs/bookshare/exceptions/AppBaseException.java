package org.bs.bookshare.exceptions;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;


public class AppBaseException extends Exception{
    protected AppBaseException(String message) {
        super(message);
    }
    protected AppBaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
