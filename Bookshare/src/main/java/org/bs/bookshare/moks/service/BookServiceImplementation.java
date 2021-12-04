package org.bs.bookshare.moks.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookException;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.moks.repositories.BookRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookServiceImplementation implements BookService {  //TODO zabezpieczenia

    private final BookRepository bookRepository;

    @Override
    public Book createBook(Book book) {
        return bookRepository.save(book);
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
    public Book updateBook(Book book) throws BookException {
        Book oldBook = bookRepository.findById(book.getId()).orElseThrow(() -> new EntityNotFoundException(book.getId().toString()));
        if(!oldBook.getVersion().equals(book.getVersion())){
            throw BookException.versionMismatch();
        }
        return bookRepository.save(book);
    }
}
