package org.bs.bookshare.exceptions;

import static org.bs.bookshare.common.Codes.BOOK_ALREADY_ON_SHELF;
import static org.bs.bookshare.common.Codes.BOOK_COPY_NOT_FOUND;
import static org.bs.bookshare.common.Codes.BOOK_NOT_AVAILABLE;
import static org.bs.bookshare.common.Codes.CANT_ADD_NOT_OWNED_BOOK_TO_SHELF;
import static org.bs.bookshare.common.Codes.CANT_CANCEL_NOT_OWN_RESERVATION;
import static org.bs.bookshare.common.Codes.CANT_CANCEL_NOT_RESERVED_BOOK;
import static org.bs.bookshare.common.Codes.CANT_RENT_NOT_AVAILABLE_BOOK;
import static org.bs.bookshare.common.Codes.CANT_RESERVE_NOT_AVAILABLE_BOOK;
import static org.bs.bookshare.common.Codes.USER_BOOK_RESERVATION_LIMIT_REACHED;
import static org.bs.bookshare.common.Codes.VERSION_MISMATCH;

public class BookCopyException extends AppBaseException{
    protected BookCopyException(String message) {
        super(message);
    }

    public static BookCopyException bookCopyNotFound() {
        return new BookCopyException(BOOK_COPY_NOT_FOUND);
    }

    public static BookCopyException cantRentNotAvailableBook() {
        return new BookCopyException(CANT_RENT_NOT_AVAILABLE_BOOK);
    }

    public static BookCopyException cantReserveNotAvailableBook() {
        return new BookCopyException(CANT_RESERVE_NOT_AVAILABLE_BOOK);
    }

    public static BookCopyException userBookReservationLimitReached() {
        return new BookCopyException(USER_BOOK_RESERVATION_LIMIT_REACHED);
    }

    public static BookCopyException cantCancelNotReservedBook() {
        return new BookCopyException(CANT_CANCEL_NOT_RESERVED_BOOK);
    }

    public static BookCopyException cantCancelNotOwnReservation() {
        return new BookCopyException(CANT_CANCEL_NOT_OWN_RESERVATION);
    }

    public static BookCopyException cantAddNotOwnedBookToShelf() {
        return new BookCopyException(CANT_ADD_NOT_OWNED_BOOK_TO_SHELF);
    }

    public static BookCopyException versionMismatch() {
        return new BookCopyException(VERSION_MISMATCH);
    }

    public static BookCopyException bookNotAvailable() {return new BookCopyException(BOOK_NOT_AVAILABLE);
    }

    public static BookCopyException bookAlreadyOnShelf() {return new BookCopyException(BOOK_ALREADY_ON_SHELF);
    }
}
