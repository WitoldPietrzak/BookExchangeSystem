package org.bs.bookshare.moks.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.GenreException;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.Genre;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.moks.dto.request.AddBookRequestDTO;
import org.bs.bookshare.moks.service.BookService;
import org.bs.bookshare.moks.service.GenreService;
import org.springframework.http.ResponseEntity;
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

    @RolesAllowed({Roles.ROLE_USER})
    @PostMapping("/add")
    public ResponseEntity<?> addBook(@RequestBody AddBookRequestDTO dto) throws GenreException {


        List<Genre> genres = new LinkedList<>();
        for (Long i : dto.getGenres()) {
            genres.add(genreService.findGenre(i));
        }
        bookService.createBook(new Book(dto.getTitle(), dto.getAuthor(), genres, dto.getReleaseDate()));
        return ResponseEntity.ok().build();
    }
}
