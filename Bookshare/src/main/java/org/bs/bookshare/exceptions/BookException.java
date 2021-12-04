package org.bs.bookshare.exceptions;

public class BookException extends AppBaseException {
    public BookException(String message) {
        super(message);
    }

    public static BookException versionMismatch() {
        return new BookException("VERSION_MISMATCH");
    }

    public static BookException notFound() {return new BookException("BOOK_NOT_FOUND");
    }
}
