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
    public List<Bookshelf> getAllBookshelvesFiltered(Float latitude, Float longitude, Double distance, Integer bookCount) throws BookshelfException {
        try {
            return bookshelfRepository.findAllInDistance(latitude.doubleValue(), longitude.doubleValue(), distance, bookCount);
        }catch (Exception e){
            throw BookshelfException.queryError();
        }

    }

    @Override
    public Bookshelf getBookshelf(Long id) throws BookshelfException {
        return bookshelfRepository.findById(id).orElseThrow(BookshelfException::userNotFound);
    }
}
