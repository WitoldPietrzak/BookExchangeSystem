package org.bs.bookshare.moks.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookCopyException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.CoverType;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.repositories.AppUserRepository;
import org.bs.bookshare.moks.repositories.BookCopyRepository;
import org.bs.bookshare.moks.repositories.BookRepository;
import org.bs.bookshare.mop.repositories.BookshelfRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BookCopyServiceImplementation implements BookCopyService {

    private final AppUserRepository userRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BookshelfRepository bookshelfRepository;
    private final BookRepository bookRepository;

    @Override
    public BookCopy createBookCopy(Book book, CoverType coverType) {
        String creatorName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser creator = userRepository.findByLogin(creatorName);

        BookCopy bookCopy = new BookCopy(book, creator, coverType);
        bookCopy.setCreatedBy(creator);

        return bookCopyRepository.save(bookCopy);
    }

    @Override
    public void addBookCopyToShelf(BookCopy bookCopy, Bookshelf bookshelf) throws BookCopyException {
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);
        if (bookCopy.getOwner() != caller && caller.getAppRoles().stream().noneMatch(role -> {
            return role.getName().equals(Roles.ROLE_MODERATOR);
        })) {
            throw BookCopyException.cantAddNotOwnedBookToShelf();
        }
        bookCopy.setOwner(null);
        bookCopy.setBookshelf(bookshelf);

    }

    @Override
    public void addBookCopyToUser(BookCopy bookCopy) throws BookCopyException {
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);

        if (!bookCopy.isAvailable()) {
            throw BookCopyException.cantRentNotAvailableBook();
        }

        bookCopy.setBookshelf(null);
        bookCopy.setOwner(caller);


    }

    @Override
    public void addBookCopyReservation(BookCopy bookCopy) throws BookCopyException {
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);

        if (!bookCopy.isAvailable()) {
            throw BookCopyException.cantReserveNotAvailableBook();
        }
        if (caller.getReservedBooks().size() > 3) {  //TODO do zmiennej?
            throw BookCopyException.userBookReservationLimitReached();
        }
        bookCopy.setReserved(caller);

    }

    @Override
    public void cancelBookCopyReservation(BookCopy bookCopy) throws BookCopyException {
        String callerName = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AppUser caller = userRepository.findByLogin(callerName);
        if (bookCopy.getReserved() == null) {
            throw BookCopyException.cantCancelNotReservedBook();
        }
        if (bookCopy.getReserved() != caller && caller.getAppRoles().stream().noneMatch(role -> {
            return role.getName().equals(Roles.ROLE_MODERATOR);
        })) {
            throw BookCopyException.cantCancelNotOwnReservation();
        }
        bookCopy.setReserved(null);

    }

    @Override
    public BookCopy getBookCopy(Long id) throws BookCopyException {
        return bookCopyRepository.findById(id).orElseThrow(BookCopyException::bookCopyNotFound);
    }

    @Override
    public List<BookCopy> getAllBookCopies() {
        return bookCopyRepository.findAll();
    }
}
