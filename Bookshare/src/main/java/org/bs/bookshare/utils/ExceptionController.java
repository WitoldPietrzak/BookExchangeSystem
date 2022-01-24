package org.bs.bookshare.utils;

import lombok.extern.log4j.Log4j2;
import org.bs.bookshare.exceptions.AppBaseException;
import org.bs.bookshare.mok.dto.response.MessageResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
@Log4j2
public class ExceptionController {

    @ExceptionHandler(AppBaseException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageResponseDTO processException(Exception e) {
        log.error(e.getMessage(),e); //TODO
        return new MessageResponseDTO(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageResponseDTO processUnknownException(Exception e) {
        log.error(e.getMessage(),e); //TODO
        return new MessageResponseDTO("unknown_error_occured");  //TODO;
    }

    @ExceptionHandler({MethodArgumentTypeMismatchException.class,NumberFormatException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageResponseDTO processParseException(Exception e) {
        log.error(e.getMessage(),e); //TODO
        return new MessageResponseDTO("wrong_argument_exception");  //TODO;
    }
}
