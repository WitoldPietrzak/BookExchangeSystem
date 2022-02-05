package org.bs.bookshare.moks.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.exceptions.BookCopyException;
import org.bs.bookshare.exceptions.BookException;
import org.bs.bookshare.exceptions.BookshelfException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.service.AppUserService;
import org.bs.bookshare.moks.dto.request.AddBookCopyRequestDTO;
import org.bs.bookshare.moks.dto.request.DeleteEntityRequestDTO;
import org.bs.bookshare.moks.dto.request.FilteredBookCopyListRequestDTO;
import org.bs.bookshare.moks.dto.request.ModifyBookCopyRequestDTO;
import org.bs.bookshare.moks.dto.request.MoveBookCopyRequestDTO;
import org.bs.bookshare.moks.dto.request.ReturnBookCopyToShelfDTO;
import org.bs.bookshare.moks.dto.request.SimpleBookCopyRequestDTO;
import org.bs.bookshare.moks.dto.response.BookCopyListElementResponseDTO;
import org.bs.bookshare.moks.dto.response.BookCopyListResponseDTO;
import org.bs.bookshare.moks.dto.response.EntityCreatedResponseDTO;
import org.bs.bookshare.moks.service.BookCopyService;
import org.bs.bookshare.moks.service.BookService;
import org.bs.bookshare.mop.service.BookshelfService;
import org.bs.bookshare.utils.DistanceCounter;
import org.bs.bookshare.utils.converter.BookConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/copy")
@RequiredArgsConstructor
public class BookCopyController {

    private final BookCopyService bookCopyService;
    private final BookService bookService;
    private final BookshelfService bookshelfService;
    private final AppUserService appUserService;


    @GetMapping("/get/{id}")
    @PermitAll
    public ResponseEntity<?> getBookCopy(@PathVariable Long id) throws BookCopyException {
        return ResponseEntity.ok()
                .body(BookConverter
                        .bookCopyResponseDTOFromBookCopy(
                                bookCopyService.getBookCopy(id)));
    }

    @GetMapping("/get/all")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> getAllBookCopies() throws BookCopyException {
        return ResponseEntity.ok()
                .body(new BookCopyListResponseDTO(bookCopyService.getAllBookCopies()
                        .stream()
                        .map(bookCopy -> new BookCopyListElementResponseDTO(
                                bookCopy.getId(),
                                bookCopy.getBook().getTitle(),
                                BookConverter.authorInnerResponseDTOFromAuthor(bookCopy.getBook().getAuthor()),
                                bookCopy.isAvailable(),
                                bookCopy.getCoverType().name(),
                                bookCopy.getLanguage(),
                                bookCopy.getBook()
                                        .getGenres()
                                        .stream()
                                        .map(BookConverter::simpleGenreResponseDTOFromGenre)
                                        .collect(Collectors.toList()),
                                bookCopy.getBook().getReleaseDate()))
                        .collect(Collectors.toList())));
    }

    @GetMapping("/get/all/owned")
    @RolesAllowed({Roles.ROLE_USER})
    public ResponseEntity<?> getAllOwnedBookCopies(Principal principal) throws BookCopyException, AppUserException {
        AppUser appUser = appUserService.getUser(principal.getName());
        return ResponseEntity.ok()
                .body(new BookCopyListResponseDTO(appUser.getPossessedBooks()
                        .stream()
                        .map(bookCopy -> new BookCopyListElementResponseDTO(
                                bookCopy.getId(),
                                bookCopy.getBook().getTitle(),
                                BookConverter.authorInnerResponseDTOFromAuthor(bookCopy.getBook().getAuthor()),
                                bookCopy.isAvailable(),
                                bookCopy.getCoverType().name(),
                                bookCopy.getLanguage(),
                                bookCopy.getBook()
                                        .getGenres()
                                        .stream()
                                        .map(BookConverter::simpleGenreResponseDTOFromGenre)
                                        .collect(Collectors.toList()),
                                bookCopy.getBook().getReleaseDate()))
                        .collect(Collectors.toList())));
    }

    @GetMapping("/get/all/reserved")
    @RolesAllowed({Roles.ROLE_USER})
    public ResponseEntity<?> getAllReservedBookCopies(Principal principal) throws BookCopyException, AppUserException {
        AppUser appUser = appUserService.getUser(principal.getName());
        return ResponseEntity.ok()
                .body(new BookCopyListResponseDTO(appUser.getReservedBooks()
                        .stream()
                        .map(bookCopy -> new BookCopyListElementResponseDTO(
                                bookCopy.getId(),
                                bookCopy.getBook().getTitle(),
                                BookConverter.authorInnerResponseDTOFromAuthor(bookCopy.getBook().getAuthor()),
                                bookCopy.isAvailable(),
                                bookCopy.getCoverType().name(),
                                bookCopy.getLanguage(),
                                bookCopy.getBook()
                                        .getGenres()
                                        .stream()
                                        .map(BookConverter::simpleGenreResponseDTOFromGenre)
                                        .collect(Collectors.toList()),
                                bookCopy.getBook().getReleaseDate(),
                                bookCopy.getReservedUntil().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))))
                        .collect(Collectors.toList())));
    }

    @GetMapping("/get/all/created")
    @RolesAllowed({Roles.ROLE_USER})
    public ResponseEntity<?> getAllCreatedBookCopies(Principal principal) throws BookCopyException, AppUserException {
        AppUser appUser = appUserService.getUser(principal.getName());
        return ResponseEntity.ok()
                .body(new BookCopyListResponseDTO(appUser.getCreatedBooks()
                        .stream()
                        .map(bookCopy -> new BookCopyListElementResponseDTO(
                                bookCopy.getId(),
                                bookCopy.getBook().getTitle(),
                                BookConverter.authorInnerResponseDTOFromAuthor(bookCopy.getBook().getAuthor()),
                                bookCopy.isAvailable(),
                                bookCopy.getCoverType().name(),
                                bookCopy.getLanguage(),
                                bookCopy.getBook()
                                        .getGenres()
                                        .stream()
                                        .map(BookConverter::simpleGenreResponseDTOFromGenre)
                                        .collect(Collectors.toList()),
                                bookCopy.getBook().getReleaseDate()))
                        .collect(Collectors.toList())));
    }

    @PostMapping("/get/all")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> getAllBookCopies(@RequestBody FilteredBookCopyListRequestDTO dto) {
        return ResponseEntity.ok()
                .body(new BookCopyListResponseDTO(bookCopyService.getAllBookCopiesFiltered(
                        dto.getBook(),
                        dto.getTitle(),
                        dto.getAuthor(),
                        dto.getGenres(),
                        dto.getReleasedBefore(),
                        dto.getReleasedAfter(),
                        dto.getLanguage(),
                        dto.getCoverType(),
                        dto.getAvailability(),
                        dto.getLat(),
                        dto.getLng(),
                        dto.getDistance())
                        .stream()
                        .map(bookCopy -> new BookCopyListElementResponseDTO(
                                bookCopy.getId(),
                                bookCopy.getBook().getTitle(),
                                BookConverter.authorInnerResponseDTOFromAuthor(bookCopy.getBook().getAuthor()),
                                bookCopy.isAvailable(),
                                bookCopy.getBookshelf() != null ? DistanceCounter.calculateDistance(
                                        dto.getLat(),
                                        dto.getLng(),
                                        bookCopy.getBookshelf().getLocationLat(),
                                        bookCopy.getBookshelf().getLocationLong()) : null,
                                bookCopy.getCoverType().name(),
                                bookCopy.getLanguage(),
                                bookCopy.getBook()
                                        .getGenres()
                                        .stream()
                                        .map(BookConverter::simpleGenreResponseDTOFromGenre)
                                        .collect(Collectors.toList()),
                                bookCopy.getBook().getReleaseDate()))
                        .collect(Collectors.toList())));
    }

    @PostMapping("/add")
    @RolesAllowed({Roles.ROLE_USER})
    public ResponseEntity<?> createBookCopy(@RequestBody AddBookCopyRequestDTO dto) throws BookException {
        Book book = bookService.findBook(dto.getBookId());
        BookCopy bookCopy = bookCopyService.createBookCopy(book, dto.getCoverType(), dto.getLanguage());
        return ResponseEntity.ok().body(new EntityCreatedResponseDTO(bookCopy.getId()));
    }

    @PostMapping("/modify")
    @RolesAllowed({Roles.ROLE_MODERATOR})
    public ResponseEntity<?> modifyBookCopy(@RequestBody ModifyBookCopyRequestDTO dto) throws BookException, BookCopyException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getId());
        Book book = bookService.findBook(dto.getBookId());
         bookCopyService.modifyBookCopy(bookCopy,book,dto.getCoverType(),dto.getLanguage(),dto.getVersion());
        return ResponseEntity.ok().body(new EntityCreatedResponseDTO(bookCopy.getId()));
    }

    @PostMapping("/return")
    @RolesAllowed({Roles.ROLE_USER})
    public ResponseEntity<?> returnBookCopyToShelf(@RequestBody ReturnBookCopyToShelfDTO dto) throws BookCopyException, BookshelfException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getBookCopyId());
        Bookshelf bookshelf = bookshelfService.getBookshelf(dto.getBookshelfId());

        bookCopyService.addBookCopyToShelf(bookCopy, bookshelf, dto.getVersion());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/take")
    @RolesAllowed({Roles.ROLE_USER})
    public ResponseEntity<?> takeBookCopyFromShelf(@RequestBody SimpleBookCopyRequestDTO dto) throws BookCopyException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getBookCopyId());
        bookCopyService.addBookCopyToUser(bookCopy, dto.getVersion());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reservation/make")
    @RolesAllowed({Roles.ROLE_USER})
    public ResponseEntity<?> makeBookCopyReservation(@RequestBody SimpleBookCopyRequestDTO dto) throws BookCopyException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getBookCopyId());
        bookCopyService.addBookCopyReservation(bookCopy, dto.getVersion());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reservation/cancel")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> cancelBookCopyReservation(@RequestBody SimpleBookCopyRequestDTO dto) throws BookCopyException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getBookCopyId());
        bookCopyService.cancelBookCopyReservation(bookCopy, dto.getVersion());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/delete")
    @RolesAllowed({Roles.ROLE_MODERATOR})
    public ResponseEntity<?> deleteBook(@RequestBody DeleteEntityRequestDTO dto) throws BookCopyException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getId());
        bookCopyService.deleteBookCopy(bookCopy, dto.getVersion());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/move")
    @RolesAllowed({Roles.ROLE_MODERATOR})
    public ResponseEntity<?> moveBook(@RequestBody MoveBookCopyRequestDTO dto) throws BookCopyException, BookshelfException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getId());
        Bookshelf bookshelf = bookshelfService.getBookshelf(dto.getBookshelfId());
        bookCopyService.moveBookCopy(bookCopy,bookshelf,dto.getVersion());
        return ResponseEntity.ok().build();
    }
}
