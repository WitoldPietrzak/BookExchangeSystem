package org.bs.bookshare.moks.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AuthorException;
import org.bs.bookshare.exceptions.BookException;
import org.bs.bookshare.exceptions.GenreException;
import org.bs.bookshare.model.Author;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.Genre;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.moks.dto.request.FilteredBookListRequestDTO;
import org.bs.bookshare.moks.dto.response.BookCopyInnerResponseDTO;
import org.bs.bookshare.moks.dto.request.AddBookRequestDTO;
import org.bs.bookshare.moks.dto.response.AuthorInnerResponseDTO;
import org.bs.bookshare.moks.dto.response.BookCopyListResponseDTO;
import org.bs.bookshare.moks.dto.response.BookListResponseDTO;
import org.bs.bookshare.moks.dto.response.DetailBookResponseDTO;
import org.bs.bookshare.moks.dto.response.EntityCreatedResponseDTO;
import org.bs.bookshare.moks.dto.response.SimpleBookResponseDTO;
import org.bs.bookshare.moks.dto.response.SimpleGenreResponseDTO;
import org.bs.bookshare.moks.service.AuthorService;
import org.bs.bookshare.moks.service.BookService;
import org.bs.bookshare.moks.service.GenreService;
import org.bs.bookshare.utils.converter.BookConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/book")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final GenreService genreService;
    private final AuthorService authorService;

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @PostMapping("/add")
    public ResponseEntity<?> addBook(@RequestBody AddBookRequestDTO dto) throws GenreException, AuthorException {
        List<Genre> genres = new LinkedList<>();
        for (Long i : dto.getGenres()) {
            genres.add(genreService.findGenre(i));
        }
        Author author = authorService.getAuthor(dto.getAuthor());
        Book book = bookService.createBook(dto.getTitle(), dto.getReleaseDate(), author, genres);
        return ResponseEntity.ok().body(new EntityCreatedResponseDTO(book.getId()));
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @GetMapping("/delete/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) throws BookException {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @GetMapping("/all")
    public ResponseEntity<?> getAllBooks() {

        return ResponseEntity.ok().body(
                new BookListResponseDTO(
                        bookService.getAllBooks()
                                .stream()
                                .map(BookConverter::bookListElementResponseDTOFromBook)
                                .collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @PostMapping("/all")
    public ResponseEntity<?> getAllBooksFiltered(@RequestBody FilteredBookListRequestDTO dto) {

        return ResponseEntity.ok().body(
                new BookListResponseDTO(
                        bookService.getAllBooksFiltered(
                                dto.getTitle(),
                                dto.getAuthor(),
                                dto.getGenres(),
                                dto.getReleasedBefore(),
                                dto.getReleasedAfter(),
                                dto.getCopyCount())
                                .stream()
                                .map(BookConverter::bookListElementResponseDTOFromBook)
                                .collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @GetMapping("/info/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) throws BookException {
        Book book = bookService.findBook(id);
        return ResponseEntity.ok().body(
                new DetailBookResponseDTO(
                        book.getId(),
                        book.getTitle(),
                        BookConverter.authorInnerResponseDTOFromAuthor(book.getAuthor()),
                        book.getReleaseDate(),
                        book.getGenres()
                                .stream()
                                .map(BookConverter::simpleGenreResponseDTOFromGenre)
                                .collect(Collectors.toList()),
                        book.getCopies()
                                .stream()
                                .map(bookCopy -> new BookCopyInnerResponseDTO(
                                        bookCopy.getId(),
                                        bookCopy.isAvailable(),
                                        bookCopy.getCoverType().name(),
                                        bookCopy.getLanguage()))
                                .collect(Collectors.toList()),
                        book.getVersion()));
    }
}
