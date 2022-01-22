package org.bs.bookshare.exceptions;

import org.bs.bookshare.model.Author;

import static org.bs.bookshare.common.Codes.AUTHOR_NOT_FOUND;
import static org.bs.bookshare.common.Codes.CANT_DELETE_AUTHOR_WITH_BOOKS;

public class AuthorException extends AppBaseException{
    protected AuthorException(String message) {
        super(message);
    }


    public static AuthorException authorNotFound() {
        return new AuthorException(AUTHOR_NOT_FOUND);
    }

    public static AuthorException cantDeleteAuthorWithBooks() {
        return new AuthorException(CANT_DELETE_AUTHOR_WITH_BOOKS);
    }
}