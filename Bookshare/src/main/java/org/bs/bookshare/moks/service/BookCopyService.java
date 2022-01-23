package org.bs.bookshare.moks.service;

import org.bs.bookshare.exceptions.BookCopyException;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.CoverType;

import java.util.List;

public interface BookCopyService{
    public BookCopy createBookCopy(Book book, CoverType coverType);
    public void addBookCopyToShelf(BookCopy bookCopy, Bookshelf bookshelf) throws BookCopyException;
    public void addBookCopyToUser(BookCopy bookCopy) throws BookCopyException;
    public void addBookCopyReservation(BookCopy bookCopy) throws BookCopyException;
    public void cancelBookCopyReservation(BookCopy bookCopy) throws BookCopyException;
    public BookCopy getBookCopy(Long id) throws BookCopyException;
    public List<BookCopy> getAllBookCopies();

}
