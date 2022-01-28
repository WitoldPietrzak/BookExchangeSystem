package org.bs.bookshare.moks.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookCopyException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.BookActionType;
import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.model.BookStory;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.CoverType;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.bs.bookshare.moks.repositories.BookCopyRepository;
import org.bs.bookshare.moks.repositories.BookRepository;
import org.bs.bookshare.moks.repositories.BookStoryRepository;
import org.bs.bookshare.mop.repositories.BookshelfRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BookCopyServiceImplementation implements BookCopyService {

    private final AppUserRepository userRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BookStoryRepository storyRepository;
    private final EntityManager entityManager;

    @Override
    public BookCopy createBookCopy(Book book, CoverType coverType, String language) {
        String creatorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser creator = userRepository.findByLogin(creatorName);

        BookCopy bookCopy = new BookCopy(book, creator, coverType, language);
        bookCopy.setCreatedBy(creator);
        BookStory bookStory = new BookStory(bookCopy, BookActionType.CREATED);
        bookStory.setCreatedBy(creator);
        bookCopy = bookCopyRepository.save(bookCopy);
        storyRepository.save(bookStory);
        return bookCopy;
    }

    @Override
    public void addBookCopyToShelf(BookCopy bookCopy, Bookshelf bookshelf, Long version) throws BookCopyException {

        if (!version.equals(bookCopy.getVersion())) {
            throw BookCopyException.versionMismatch();
        }
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);
        if (bookCopy.getOwner() != caller && caller.getAppRoles().stream().noneMatch(role -> role.getName().equals(Roles.ROLE_MODERATOR))) {
            throw BookCopyException.cantAddNotOwnedBookToShelf();
        }
        bookCopy.setOwner(null);
        bookCopy.setBookshelf(bookshelf);
        bookCopy.setModifiedBy(caller);

        BookStory bookStory = new BookStory(bookCopy, BookActionType.PUT, bookshelf.getLocationLat(), bookshelf.getLocationLong());
        bookStory.setCreatedBy(caller);
        storyRepository.save(bookStory);

    }

    @Override
    public void addBookCopyToUser(BookCopy bookCopy, Long version) throws BookCopyException {
        if (!version.equals(bookCopy.getVersion())) {
            throw BookCopyException.versionMismatch();
        }
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);

        if (!bookCopy.isAvailableForUser(caller)) {
            throw BookCopyException.cantRentNotAvailableBook();
        }

        BookStory bookStory = new BookStory(bookCopy, BookActionType.TAKEN, bookCopy.getBookshelf().getLocationLat(), bookCopy.getBookshelf().getLocationLong());
        bookStory.setCreatedBy(caller);
        storyRepository.save(bookStory);
        bookCopy.setBookshelf(null);
        bookCopy.setOwner(caller);
        bookCopy.setReserved(null);
        bookCopy.setModifiedBy(caller);


    }

    @Override
    public void addBookCopyReservation(BookCopy bookCopy, Long version) throws BookCopyException {
        if (!version.equals(bookCopy.getVersion())) {
            throw BookCopyException.versionMismatch();
        }
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);

        if (!bookCopy.isAvailable()) {
            throw BookCopyException.cantReserveNotAvailableBook();
        }
        if (caller.getReservedBooks().size() > 3) {  //TODO do zmiennej?
            throw BookCopyException.userBookReservationLimitReached();
        }
        bookCopy.setReserved(caller);
        bookCopy.setReservedUntil(LocalDateTime.now().plusDays(7)); //TODO do zmiennej?
        bookCopy.setModifiedBy(caller);

    }

    @Override
    public void deleteBookCopy(BookCopy bookCopy, Long version) throws BookCopyException {
        if (!version.equals(bookCopy.getVersion())) {
            throw BookCopyException.versionMismatch();
        }
        storyRepository.deleteAll(bookCopy.getStory());
        bookCopyRepository.delete(bookCopy);


    }

    @Override
    public void cancelBookCopyReservation(BookCopy bookCopy, Long version) throws BookCopyException {
        if (!version.equals(bookCopy.getVersion())) {
            throw BookCopyException.versionMismatch();
        }
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);
        if (bookCopy.getReserved() == null) {
            throw BookCopyException.cantCancelNotReservedBook();
        }
        if (bookCopy.getReserved() != caller && caller.getAppRoles().stream().noneMatch(role -> role.getName().equals(Roles.ROLE_MODERATOR))) {
            throw BookCopyException.cantCancelNotOwnReservation();
        }
        bookCopy.setReserved(null);
        bookCopy.setModifiedBy(caller);

    }

    @Override
    public BookCopy getBookCopy(Long id) throws BookCopyException {
        return bookCopyRepository.findById(id).orElseThrow(BookCopyException::bookCopyNotFound);
    }

    @Override
    public List<BookCopy> getAllBookCopies() {
        return bookCopyRepository.findAll();
    }

    @Override
    public List<BookCopy> getAllBookCopiesFiltered(Long book, String title, Long author, List<Long> genres, Integer releasedBefore, Integer releasedAfter, String language, CoverType coverType, Boolean availability, Double lat, Double lng, Double distance) {

        if (lat == null || lng == null || distance == null) {
            return bookCopyRepository.findAllFiltered(book, title, author, genres, releasedBefore, releasedAfter, language, coverType, availability, genres != null ? genres.size() : 0L);
        }

        return bookCopyRepository.findAllFilteredWithLocation(book, title, author, genres, releasedBefore, releasedAfter, language, coverType, availability, genres != null ? genres.size() : 0L, lat, lng, distance);
    }

    @Override
    public void moveBookCopy(BookCopy bookCopy, Bookshelf bookshelf, Long version) throws BookCopyException {
        if (!version.equals(bookCopy.getVersion())) {
            throw BookCopyException.versionMismatch();
        }
        if (!bookCopy.isAvailable()) {
            throw BookCopyException.bookNotAvailable();
        }
        if (bookCopy.getBookshelf() == bookshelf) {
            throw BookCopyException.bookAlreadyOnShelf();
        }
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);

        BookStory bookStory = new BookStory(bookCopy, BookActionType.MOVED, bookCopy.getBookshelf().getLocationLat(), bookCopy.getBookshelf().getLocationLong(), bookshelf.getLocationLat(), bookshelf.getLocationLong());
        bookStory.setCreatedBy(caller);
        storyRepository.save(bookStory);
        bookCopy.setBookshelf(bookshelf);


    }


    @Scheduled(cron = "0 0 0 * * *")
    public void cancelReservations() {
        Query query = entityManager.createQuery("SELECT bc FROM BookCopy bc WHERE bc.reserved is not null AND bc.reservedUntil < :date");
        List<BookCopy> copies = query.setParameter("date", LocalDateTime.now()).getResultList();
        copies.forEach(bookCopy -> {
            bookCopy.setReserved(null);
            bookCopy.setReservedUntil(null);
        });
    }
}
