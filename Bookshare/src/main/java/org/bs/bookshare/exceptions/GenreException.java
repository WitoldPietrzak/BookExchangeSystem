package org.bs.bookshare.exceptions;

public class GenreException extends AppBaseException{
    public GenreException(String message) {
        super(message);
    }

    public static GenreException genreExists() {
        return new GenreException("GENRE_EXISTS");
    }

    public static GenreException genreNotFound() {
        return new GenreException("GENRE_NOT_FOUND");
    }
}
