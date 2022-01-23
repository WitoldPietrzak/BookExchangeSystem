package org.bs.bookshare.mop.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookshelfException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.bs.bookshare.mop.repositories.BookshelfRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookshelfServiceImplementation implements BookshelfService {

    private final BookshelfRepository bookshelfRepository;
    private final AppUserRepository userRepository;

    @Override
    public Bookshelf createBookshelf(Double latitude, Double longitude) {
        Bookshelf bookshelf = new Bookshelf(latitude, longitude);
        String creatorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser creator = userRepository.findByLogin(creatorName);
        bookshelf.setCreatedBy(creator);
        return bookshelfRepository.save(bookshelf);
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
            e.printStackTrace(); //TODO
            throw BookshelfException.queryError();
        }

    }

    @Override
    public Bookshelf getBookshelf(Long id) throws BookshelfException {
        return bookshelfRepository.findById(id).orElseThrow(BookshelfException::userNotFound);
    }

    @Override
    public void moveShelf(Bookshelf bookshelf, Double lat, Double lng, Long version) throws BookshelfException {
        if (!bookshelf.getVersion().equals(version)) {
            throw BookshelfException.versionMismatch();
        }
        bookshelf.setLocationLat(lat);
        bookshelf.setLocationLong(lng);
        String modifierName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser modifier = userRepository.findByLogin(modifierName);
        bookshelf.setModifiedBy(modifier);
    }

    @Override
    public void removeShelf(Bookshelf bookshelf, Long version) throws BookshelfException {
        if (!bookshelf.getVersion().equals(version)) {
            throw BookshelfException.versionMismatch();
        }
        if (bookshelf.getBooksOnShelf().size() > 0) {
            throw BookshelfException.cantDeleteBookshelfWithBooks();
        }
        bookshelfRepository.delete(bookshelf);
    }
}
