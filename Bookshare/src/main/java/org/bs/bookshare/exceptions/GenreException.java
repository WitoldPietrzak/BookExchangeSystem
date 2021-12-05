package org.bs.bookshare.exceptions;

import static org.bs.bookshare.common.Codes.GENRE_EXIST;
import static org.bs.bookshare.common.Codes.GENRE_NOT_EXIST;

public class GenreException extends AppBaseException {
    public GenreException(String message) {
        super(message);
    }

    public static GenreException genreExists() {
        return new GenreException(GENRE_EXIST);
    }

    public static GenreException genreNotFound() {
        return new GenreException(GENRE_NOT_EXIST);
    }
}
