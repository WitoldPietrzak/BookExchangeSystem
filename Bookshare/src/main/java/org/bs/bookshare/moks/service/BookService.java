package org.bs.bookshare.moks.service;

import org.bs.bookshare.exceptions.BookException;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.Genre;

import java.util.List;

public interface BookService {
    Book createBook(Book book);
    Book findBook(Long id) throws BookException;
    List<Book> findBook(String name);
    void removeBook(Long id) throws BookException;
    List<Book> getAllBooks();
    Book updateBook(Book book) throws BookException;


}
