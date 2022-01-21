package org.bs.bookshare.mop.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookshelfException;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.mop.repositories.BookshelfRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookshelfServiceImplementation implements BookshelfService {

    private final BookshelfRepository bookshelfRepository;

    @Override
    public Bookshelf createBookshelf(Float latitude, Float longitude) {
        Bookshelf bookshelf = new Bookshelf(latitude, longitude);
        bookshelfRepository.save(bookshelf);
        return bookshelf;
    }

    @Override
    public List<Bookshelf> getAllBookshelves() {
        return bookshelfRepository.findAll();
    }

    @Override
    public List<Bookshelf> getAllBookshelvesFiltered(Double latitude, Double longitude, Double distance, Integer bookCount) throws BookshelfException {
        try {
            if (longitude == null || latitude == null) {
                return bookshelfRepository.findAllNoDistance(bookCount);
            }
            return bookshelfRepository.findAllInDistance(latitude, longitude, distance, bookCount);
        } catch (Exception e) {
            e.printStackTrace();
            throw BookshelfException.queryError();
        }

    }

    @Override
    public Bookshelf getBookshelf(Long id) throws BookshelfException {
        return bookshelfRepository.findById(id).orElseThrow(BookshelfException::userNotFound);
    }
}
