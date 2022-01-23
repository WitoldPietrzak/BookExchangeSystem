package org.bs.bookshare.mop.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.BookshelfException;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mop.dto.request.BookshelfFilteredListRequestDTO;
import org.bs.bookshare.mop.dto.request.BookshelfCreateRequestDTO;
import org.bs.bookshare.mop.dto.request.BookshelfRequestWithLocationDTO;
import org.bs.bookshare.mop.dto.request.MoveBookshelfRequestDTO;
import org.bs.bookshare.mop.dto.request.RemoveBookshelfRequestDTO;
import org.bs.bookshare.mop.dto.response.BookshelfDetailResponseDTO;
import org.bs.bookshare.mop.dto.response.BookshelfListResponseDTO;
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
                .map(BookConverter::bookshelfResponseDTOFromBookshelf)
                .collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR})
    @PostMapping("/all")
    public ResponseEntity<?> getShelvesFiltered(@RequestBody BookshelfFilteredListRequestDTO dto) throws BookshelfException {
        return ResponseEntity.ok().body(new BookshelfListResponseDTO(
                bookshelfService.getAllBookshelvesFiltered(dto.getLatitude(), dto.getLongitude(), dto.getDistance(), dto.getBookCount())
                        .stream()
                        .map(bookshelf -> BookConverter.bookshelfResponseDTOFromBookshelf(
                                bookshelf,
                                DistanceCounter.calculateDistance(
                                        dto.getLatitude(),
                                        dto.getLongitude(),
                                        bookshelf.getLocationLat(),
                                        bookshelf.getLocationLong())))
                        .collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_MODERATOR})
    @PostMapping("/add")
    public ResponseEntity<?> createShelf(@RequestBody BookshelfCreateRequestDTO dto) {
        bookshelfService.createBookshelf(dto.getLatitude(), dto.getLongitude());
        return ResponseEntity.ok().build();
    }

    @RolesAllowed({Roles.ROLE_MODERATOR, Roles.ROLE_USER})
    @GetMapping("/{id}")
    public ResponseEntity<?> getShelf(@PathVariable Long id) throws BookshelfException {
        Bookshelf bookshelf = bookshelfService.getBookshelf(id);
        return ResponseEntity.ok().body(new BookshelfDetailResponseDTO(
                bookshelf.getId(),
                bookshelf.getLocationLat(),
                bookshelf.getLocationLong(),
                bookshelf.getBooksOnShelf().stream().map(BookConverter::bookCopyInBookshelfDetailResponseDTOFromBookCopy).collect(Collectors.toList()),
                null,
                bookshelf.getVersion()));
    }

    @RolesAllowed({Roles.ROLE_MODERATOR, Roles.ROLE_USER})
    @PostMapping("/{id}")
    public ResponseEntity<?> getShelfWithLDistance(@PathVariable Long id, @RequestBody BookshelfRequestWithLocationDTO dto) throws BookshelfException {
        Bookshelf bookshelf = bookshelfService.getBookshelf(id);
        return ResponseEntity.ok().body(new BookshelfDetailResponseDTO(
                bookshelf.getId(),
                bookshelf.getLocationLat(),
                bookshelf.getLocationLong(),
                bookshelf.getBooksOnShelf().stream().map(BookConverter::bookCopyInBookshelfDetailResponseDTOFromBookCopy).collect(Collectors.toList()),
                DistanceCounter.calculateDistance(dto.getLatitude(), dto.getLongitude(), bookshelf.getLocationLat(), bookshelf.getLocationLong()),
                bookshelf.getVersion()));
    }

    @RolesAllowed({Roles.ROLE_MODERATOR})
    @PostMapping("/move")
    public ResponseEntity<?> moveShelf(@RequestBody MoveBookshelfRequestDTO dto) throws BookshelfException {
        Bookshelf bookshelf = bookshelfService.getBookshelf(dto.getShelfId());
        bookshelfService.moveShelf(bookshelf,dto.getLat(),dto.getLng(),dto.getVersion());
        return ResponseEntity.ok().build();

    }

    @RolesAllowed({Roles.ROLE_MODERATOR})
    @PostMapping("/remove")
    public ResponseEntity<?> removeShelf(@RequestBody RemoveBookshelfRequestDTO dto) throws BookshelfException {
        Bookshelf bookshelf = bookshelfService.getBookshelf(dto.getId());
        bookshelfService.removeShelf(bookshelf,dto.getVersion());
        return ResponseEntity.ok().build();

    }
}
