package org.bs.bookshare.moks.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.GenreException;
import org.bs.bookshare.model.Genre;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.moks.dto.request.AddGenreRequestDTO;
import org.bs.bookshare.moks.dto.request.DeleteGenreRequestDTO;
import org.bs.bookshare.moks.dto.response.EntityCreatedResponseDTO;
import org.bs.bookshare.moks.dto.response.GenreListResponseDTO;
import org.bs.bookshare.moks.dto.response.GenreResponseDTO;
import org.bs.bookshare.moks.dto.response.SimpleGenreResponseDTO;
import org.bs.bookshare.moks.repositories.GenreRepository;
import org.bs.bookshare.moks.service.GenreService;
import org.bs.bookshare.utils.converter.BookConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/genre")
@RequiredArgsConstructor
public class GenreController {
    private final GenreService genreService;

    @GetMapping("/all")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_ADMIN, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> getAllGenres() {
        List<Genre> genres = genreService.getAllGenres();
        return ResponseEntity.ok().body(
                new GenreListResponseDTO(
                        genreService.getAllGenres()
                                .stream()
                                .map(BookConverter::simpleGenreResponseDTOFromGenre)
                                .collect(Collectors.toList())));

    }

    @PostMapping("/add")
    @RolesAllowed({Roles.ROLE_MODERATOR})
    public ResponseEntity<?> addGenre(@RequestBody AddGenreRequestDTO dto) throws GenreException {
        Genre genre = genreService.addGenre(dto.getNameCode(), dto.getNames());
        return ResponseEntity.ok().body(new EntityCreatedResponseDTO(genre.getId()));
    }

    @GetMapping("/{id}")
    @RolesAllowed({Roles.ROLE_MODERATOR})
    public ResponseEntity<?> getGenre(@PathVariable Long id) throws GenreException {
        Genre genre = genreService.findGenre(id);
        return ResponseEntity.ok().body(new GenreResponseDTO(genre.getId(), genre.getNameCode(), genre.getName(), genre.getBooks().size(),genre.getVersion()));
    }

    @PostMapping("/delete")
    @RolesAllowed({Roles.ROLE_MODERATOR})
    public ResponseEntity<?> deleteGenre(@RequestBody DeleteGenreRequestDTO dto) throws GenreException {
        Genre genre = genreService.findGenre(dto.getId());
        genreService.deleteGenre(genre, dto.getVersion());
        return ResponseEntity.ok().build();
    }


}
