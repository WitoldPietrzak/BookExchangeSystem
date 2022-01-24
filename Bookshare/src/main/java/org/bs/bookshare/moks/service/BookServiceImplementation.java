package org.bs.bookshare.moks.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Author;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.Genre;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.bs.bookshare.moks.repositories.BookRepository;
import org.bs.bookshare.security.TokenGenerator;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookServiceImplementation implements BookService {  //TODO zabezpieczenia

    private final BookRepository bookRepository;
    private final AppUserRepository userRepository;

    @Override
    public Book createBook(String title, Integer releaseDate, Author author, List<Genre> genres) {
        Book book = new Book(title, author, genres, releaseDate);
        String creatorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser creator = userRepository.findByLogin(creatorName);
        book.setCreatedBy(creator);
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) throws BookException {
        Book book = bookRepository.findById(id).orElseThrow(BookException::notFound);
        if (book.getCopies().size() > 0) {
            throw BookException.cantDeleteBookWithExamples();
        }
        bookRepository.delete(book);
    }

    @Override
    public Book findBook(Long id) throws BookException {
        return bookRepository.findById(id).orElseThrow(BookException::notFound);
    }

    @Override
    public List<Book> findBook(String title) {
        return bookRepository.findAllByTitle(title);
    }

    @Override
    public void removeBook(Long id) throws BookException {

        bookRepository.delete(findBook(id));
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public List<Book> getAllBooksFiltered(String title, Long author, List<Long> genres, Integer releasedBefore, Integer releasedAfter, Integer copyCount) {
        Long listSize = genres == null ? 0L : genres.size();
        return bookRepository.findAllFiltered(title, author, genres, releasedBefore, releasedAfter, copyCount,listSize );
    }

    @Override
    public Book updateBook(Book book) throws BookException {
        Book oldBook = bookRepository.findById(book.getId()).orElseThrow(() -> new EntityNotFoundException(book.getId().toString()));
        if (!oldBook.getVersion().equals(book.getVersion())) {
            throw BookException.versionMismatch();
        }
        return bookRepository.save(book);
    }
}
