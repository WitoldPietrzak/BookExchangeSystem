package org.bs.bookshare.exceptions;

import org.bs.bookshare.model.Book;

import static org.bs.bookshare.common.Codes.BOOKSHELF_NOT_FOUND;
import static org.bs.bookshare.common.Codes.QUERY_ERROR;
import static org.bs.bookshare.common.Codes.USER_NOT_FOUND;
import static org.bs.bookshare.common.Codes.VERSION_MISMATCH;

public class BookshelfException extends AppBaseException{
    protected BookshelfException(String message) {
        super(message);
    }

    public static BookshelfException userNotFound() {
        return new BookshelfException(BOOKSHELF_NOT_FOUND);
    }
    public static BookshelfException queryError() {
        return new BookshelfException(QUERY_ERROR);
    }

    public static BookshelfException versionMismatch() { return new BookshelfException(VERSION_MISMATCH);
    }
}
