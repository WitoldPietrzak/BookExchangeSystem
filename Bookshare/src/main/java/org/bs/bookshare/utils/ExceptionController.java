package org.bs.bookshare.utils;

import org.bs.bookshare.mok.dto.response.MessageResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionController {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageResponseDTO processException(Exception e) {
        return new MessageResponseDTO(e.getMessage());
    }
}
