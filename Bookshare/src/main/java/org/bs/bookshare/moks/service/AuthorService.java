package org.bs.bookshare.moks.service;

import org.bs.bookshare.exceptions.AuthorException;
import org.bs.bookshare.model.Author;

import java.util.List;

public interface AuthorService {
    Author getAuthor(Long id) throws AuthorException;
    void createAuthor(String name, String surname) throws AuthorException;
    void deleteAuthor(Long id, Long version) throws AuthorException;
    List<Author> getAllAuthors();
}
