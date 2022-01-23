package org.bs.bookshare.moks.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookCopyException;
import org.bs.bookshare.exceptions.BookException;
import org.bs.bookshare.exceptions.BookshelfException;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.moks.dto.request.AddBookCopyRequestDTO;
import org.bs.bookshare.moks.dto.request.ReturnBookCopyToShelfDTO;
import org.bs.bookshare.moks.dto.request.SimpleBookCopyRequestDTO;
import org.bs.bookshare.moks.dto.response.BookCopyListElementResponseDTO;
import org.bs.bookshare.moks.dto.response.BookCopyListResponseDTO;
import org.bs.bookshare.moks.service.BookCopyService;
import org.bs.bookshare.moks.service.BookService;
import org.bs.bookshare.mop.service.BookshelfService;
import org.bs.bookshare.utils.converter.BookConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/copy")
@RequiredArgsConstructor
public class BookCopyController {

    private final BookCopyService bookCopyService;
    private final BookService bookService;
    private final BookshelfService bookshelfService;


    @GetMapping("/get/{id}")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
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
                                bookCopy.getLanguage()))
                        .collect(Collectors.toList())));
    }

    @PostMapping("/add")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> createBookCopy(@RequestBody AddBookCopyRequestDTO dto) throws BookCopyException, BookException {
        Book book = bookService.findBook(dto.getBookId());

        bookCopyService.createBookCopy(book, dto.getCoverType(), dto.getLanguage());
        return ResponseEntity.ok().build(); //TODO odpowiedzz?
    }

    @PostMapping("/return")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> returnBookCopyToShelf(@RequestBody ReturnBookCopyToShelfDTO dto) throws BookCopyException, BookException, BookshelfException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getBookCopyId());
        Bookshelf bookshelf = bookshelfService.getBookshelf(dto.getBookshelfId());

        bookCopyService.addBookCopyToShelf(bookCopy, bookshelf, dto.getVersion());
        return ResponseEntity.ok().build(); //TODO odpowiedzz?
    }

    @PostMapping("/take")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> takeBookCopyFromShelf(@RequestBody SimpleBookCopyRequestDTO dto) throws BookCopyException, BookException, BookshelfException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getBookCopyId());
        bookCopyService.addBookCopyToUser(bookCopy, dto.getVersion());
        return ResponseEntity.ok().build(); //TODO odpowiedzz?
    }

    @PostMapping("/reservation/make")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> makeBookCopyReservation(@RequestBody SimpleBookCopyRequestDTO dto) throws BookCopyException, BookException, BookshelfException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getBookCopyId());
        bookCopyService.addBookCopyReservation(bookCopy, dto.getVersion());
        return ResponseEntity.ok().build(); //TODO odpowiedzz?
    }

    @PostMapping("/reservation/cancel")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> cancelBookCopyReservation(@RequestBody SimpleBookCopyRequestDTO dto) throws BookCopyException, BookException, BookshelfException {
        BookCopy bookCopy = bookCopyService.getBookCopy(dto.getBookCopyId());
        bookCopyService.cancelBookCopyReservation(bookCopy, dto.getVersion());
        return ResponseEntity.ok().build(); //TODO odpowiedzz?
    }
}
