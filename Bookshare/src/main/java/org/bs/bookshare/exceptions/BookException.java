package org.bs.bookshare.exceptions;

import static org.bs.bookshare.common.Codes.BOOK_NOT_FOUND;
import static org.bs.bookshare.common.Codes.CANT_DELETE_BOOK_WITH_EXAMPLES;
import static org.bs.bookshare.common.Codes.VERSION_MISMATCH;

public class BookException extends AppBaseException {
    public BookException(String message) {
        super(message);
    }

    public static BookException versionMismatch() {
        return new BookException(VERSION_MISMATCH);
    }

    public static BookException notFound() {
        return new BookException(BOOK_NOT_FOUND);
    }

    public static BookException cantDeleteBookWithExamples() {
        return new BookException(CANT_DELETE_BOOK_WITH_EXAMPLES);
    }
}
