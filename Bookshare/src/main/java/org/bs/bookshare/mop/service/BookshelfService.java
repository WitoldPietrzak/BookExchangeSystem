package org.bs.bookshare.mop.service;

import org.bs.bookshare.exceptions.BookshelfException;
import org.bs.bookshare.model.Bookshelf;

import java.util.List;

public interface BookshelfService {

    Bookshelf createBookshelf(Float latitude,Float longitude);
    List<Bookshelf> getAllBookshelves();
    List<Bookshelf>getAllBookshelvesFiltered(Float latitude, Float longitude, Double distance) throws BookshelfException;
    Bookshelf getBookshelf(Long id) throws BookshelfException;
}
