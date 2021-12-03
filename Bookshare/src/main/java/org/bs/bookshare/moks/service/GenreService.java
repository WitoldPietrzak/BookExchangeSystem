package org.bs.bookshare.moks.service;

import org.bs.bookshare.exceptions.GenreException;
import org.bs.bookshare.model.Genre;

import java.util.List;

public interface GenreService {
    Genre addGenre(Genre genre) throws GenreException;
    Genre findGenre(Long id) throws GenreException;
    Genre findGenre(String name) throws GenreException;
    List<Genre> getAllGenres();
}
