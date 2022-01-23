package org.bs.bookshare.moks.service;

import org.bs.bookshare.exceptions.BookException;
import org.bs.bookshare.model.Author;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.Genre;

import java.time.LocalDateTime;
import java.util.List;

public interface BookService {
    Book createBook(String title, Integer releaseDate, Author author, List<Genre> genres);
    Book findBook(Long id) throws BookException;
    List<Book> findBook(String name);
    void removeBook(Long id) throws BookException;
    List<Book> getAllBooks();
    Book updateBook(Book book) throws BookException;
    public void deleteBook(Long id) throws BookException;
    List<Book> getAllBooksFiltered(String title, Long author,List<Long> genres,Integer releasedBefore, Integer releasedAfter,Integer copyCount);


}
