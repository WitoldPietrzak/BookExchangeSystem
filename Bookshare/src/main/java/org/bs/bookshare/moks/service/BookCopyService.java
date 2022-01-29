package org.bs.bookshare.moks.service;

import org.bs.bookshare.exceptions.BookCopyException;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.CoverType;

import java.util.List;

public interface BookCopyService{
    BookCopy createBookCopy(Book book, CoverType coverType, String language);
    void modifyBookCopy(BookCopy bookCopy, Book book, CoverType coverType, String language, Long version) throws BookCopyException;
     void addBookCopyToShelf(BookCopy bookCopy, Bookshelf bookshelf, Long version) throws BookCopyException;
     void addBookCopyToUser(BookCopy bookCopy, Long version) throws BookCopyException;
     void addBookCopyReservation(BookCopy bookCopy, Long version) throws BookCopyException;
     void deleteBookCopy(BookCopy bookCopy, Long version) throws BookCopyException;
     void cancelBookCopyReservation(BookCopy bookCopy, Long version) throws BookCopyException;
     BookCopy getBookCopy(Long id) throws BookCopyException;
     List<BookCopy> getAllBookCopies();
     List<BookCopy> getAllBookCopiesFiltered(Long book, String title, Long author, List<Long> genres, Integer releasedBefore, Integer releasedAfter, String language, CoverType coverType, Boolean availability, Double lat, Double lng, Double distance);
     void moveBookCopy(BookCopy bookCopy,Bookshelf bookshelf, Long version) throws BookCopyException;

}
