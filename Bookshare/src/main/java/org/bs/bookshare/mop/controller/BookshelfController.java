package org.bs.bookshare.mop.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookshelfException;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.dto.response.UserListResponseDTO;
import org.bs.bookshare.mop.dto.request.BookFilteredListRequestDTO;
import org.bs.bookshare.mop.dto.request.BookshelfCreateRequestDTO;
import org.bs.bookshare.mop.dto.response.BookshelfListResponseDTO;
import org.bs.bookshare.mop.dto.response.BookshelfResponseDTO;
import org.bs.bookshare.mop.service.BookshelfService;
import org.bs.bookshare.utils.DistanceCounter;
import org.bs.bookshare.utils.converter.UserConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shelf")
@RequiredArgsConstructor
public class BookshelfController {

    private final BookshelfService bookshelfService;

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @GetMapping("/all")
    public ResponseEntity<?> getShelves() {
        return ResponseEntity.ok().body(new BookshelfListResponseDTO(bookshelfService.getAllBookshelves()
                .stream()
                .map(bookshelf -> new BookshelfResponseDTO(
                        bookshelf.getId(),
                        bookshelf.getLocationLat(),
                        bookshelf.getLocationLong(),
                        bookshelf.getBooksOnShelf().size(),
                        null,
                        bookshelf.getVersion()))
                .collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @PostMapping("/all")
    public ResponseEntity<?> getShelvesFiltered(@RequestBody BookFilteredListRequestDTO dto) throws BookshelfException {
        return ResponseEntity.ok().body(new BookshelfListResponseDTO(
                bookshelfService.getAllBookshelvesFiltered(dto.getLatitude(), dto.getLongitude(), dto.getDistance(), dto.getBookCount())
                .stream()
                .map(bookshelf -> new BookshelfResponseDTO(
                        bookshelf.getId(),
                        bookshelf.getLocationLat(),
                        bookshelf.getLocationLong(),
                        bookshelf.getBooksOnShelf().size(),
                        DistanceCounter.calculateDistance(dto.getLatitude(),dto.getLongitude(),bookshelf.getLocationLat(),bookshelf.getLocationLong()),
                        bookshelf.getVersion()))
                .collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_MODERATOR})
    @PostMapping("/add")
    public ResponseEntity<?> createShelf(@RequestBody BookshelfCreateRequestDTO dto) {
        bookshelfService.createBookshelf(dto.getLatitude(), dto.getLongitude());
        return ResponseEntity.ok().build();
    }
}
