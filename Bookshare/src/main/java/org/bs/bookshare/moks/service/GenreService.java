package org.bs.bookshare.moks.service;

import org.bs.bookshare.exceptions.GenreException;
import org.bs.bookshare.model.Genre;

import java.util.List;
import java.util.Map;

public interface GenreService {
    Genre addGenre(String codeName, Map<String,String> name) throws GenreException;
    Genre findGenre(Long id) throws GenreException;
    Genre findGenre(String name) throws GenreException;
    List<Genre> getAllGenres();
    void deleteGenre(Genre genre, Long version) throws GenreException;
}
