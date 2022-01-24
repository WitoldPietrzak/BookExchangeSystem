package org.bs.bookshare.exceptions;

import static org.bs.bookshare.common.Codes.CANT_CREATE_EMPTY_GENRE;
import static org.bs.bookshare.common.Codes.CANT_DELETE_GENRE_USED_BY_BOOKS;
import static org.bs.bookshare.common.Codes.GENRE_EXIST;
import static org.bs.bookshare.common.Codes.GENRE_NOT_EXIST;
import static org.bs.bookshare.common.Codes.VERSION_MISMATCH;

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

    public static GenreException cantCreateEmptyGenre() { return new GenreException(CANT_CREATE_EMPTY_GENRE);
    }

    public static GenreException cantDeleteGenreUsedByBooks() {return new GenreException(CANT_DELETE_GENRE_USED_BY_BOOKS);
    }

    public static GenreException versionMismatch() {return new GenreException(VERSION_MISMATCH);
    }
}
