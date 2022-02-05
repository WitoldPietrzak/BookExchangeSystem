package org.bs.bookshare.moks.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AuthorException;
import org.bs.bookshare.model.Author;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.moks.dto.request.AddAuthorRequestDTO;
import org.bs.bookshare.moks.dto.request.DeleteEntityRequestDTO;
import org.bs.bookshare.moks.dto.response.AuthorDetailResponseDTO;
import org.bs.bookshare.moks.dto.response.AuthorListElementResponseDTO;
import org.bs.bookshare.moks.dto.response.AuthorListResponseDTO;
import org.bs.bookshare.moks.dto.response.BookListInAuthorResponseDTO;
import org.bs.bookshare.moks.service.AuthorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/author")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @RolesAllowed({Roles.ROLE_USER})
    @PostMapping("/add")
    public ResponseEntity<?> addAuthor(@RequestBody AddAuthorRequestDTO dto) throws AuthorException {
        authorService.createAuthor(dto.getName(), dto.getSurname());
        return ResponseEntity.ok().build();
    }

    @RolesAllowed({Roles.ROLE_MODERATOR})
    @PostMapping("/delete")
    public ResponseEntity<?> deleteAuthor(@RequestBody DeleteEntityRequestDTO dto) throws AuthorException {
        authorService.deleteAuthor(dto.getId(),dto.getVersion());
        return ResponseEntity.ok().build();
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @GetMapping("/{id}")
    public ResponseEntity<?> getAuthor(@PathVariable Long id) throws AuthorException {
        Author author = authorService.getAuthor(id);
        return ResponseEntity.ok().body(new AuthorDetailResponseDTO(
                author.getName(),
                author.getSurname(),
                author.getBooks()
                        .stream()
                        .map(book -> new BookListInAuthorResponseDTO(
                                book.getId(),
                                book.getTitle()))
                        .collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @GetMapping("/all")
    public ResponseEntity<?> getAllAuthors() {
        List<Author> authors = authorService.getAllAuthors();
        return ResponseEntity.ok().body(new AuthorListResponseDTO(
                authors.stream()
                        .map(author -> new AuthorListElementResponseDTO(
                                author.getId(),
                                author.getName(),
                                author.getSurname(),
                                author.getBooks().size(),
                                author.getVersion()))
                        .collect(Collectors.toList())
        ));
    }


}
