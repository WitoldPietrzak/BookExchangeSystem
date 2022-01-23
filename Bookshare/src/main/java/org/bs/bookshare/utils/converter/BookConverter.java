package org.bs.bookshare.utils.converter;

import org.bs.bookshare.model.Author;
import org.bs.bookshare.model.Book;
import org.bs.bookshare.model.BookCopy;
import org.bs.bookshare.model.Bookshelf;
import org.bs.bookshare.model.Genre;
import org.bs.bookshare.moks.dto.response.AuthorInnerResponseDTO;
import org.bs.bookshare.moks.dto.response.BookCopyInnerResponseDTO;
import org.bs.bookshare.moks.dto.response.BookCopyResponseDTO;
import org.bs.bookshare.moks.dto.response.SimpleBookResponseDTO;
import org.bs.bookshare.moks.dto.response.SimpleGenreResponseDTO;
import org.bs.bookshare.mop.dto.response.BookCopyInBookshelfDetailResponseDTO;
import org.bs.bookshare.mop.dto.response.BookshelfResponseDTO;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

public class BookConverter {

    public static BookCopyResponseDTO bookCopyResponseDTOFromBookCopy(BookCopy bookCopy) {
        return new BookCopyResponseDTO(
                bookCopy.getId(),
                simpleBookResponseDTOFromBook(bookCopy.getBook()),
                bookCopy.getOwner() != null ? bookCopy.getOwner().getLogin() : null,
                bookshelfResponseDTOFromBookshelf(bookCopy.getBookshelf()),
                bookCopy.getReserved() != null ? bookCopy.getReserved().getLogin() : null,
                bookCopy.getReservedUntil() != null ? bookCopy.getReservedUntil().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : null,
                bookCopy.getCoverType().name(),
                bookCopy.getVersion()
        );
    }

    public static BookCopyInnerResponseDTO bookCopyInnerResponseDTOfromBookCopy(BookCopy bookCopy) {
        if(bookCopy == null){
            return new BookCopyInnerResponseDTO();
        }
        return new BookCopyInnerResponseDTO(
                bookCopy.getId(),
                bookCopy.isAvailable(),
                bookCopy.getCoverType().name()
        );

    }
    public static BookCopyInBookshelfDetailResponseDTO bookCopyInBookshelfDetailResponseDTOFromBookCopy(BookCopy bookCopy) {
        if(bookCopy == null){
            return new BookCopyInBookshelfDetailResponseDTO();
        }
        return new BookCopyInBookshelfDetailResponseDTO(
                bookCopy.getId(),
                bookCopy.isAvailable(),
                bookCopy.getCoverType().name(),
                authorInnerResponseDTOFromAuthor(bookCopy.getBook().getAuthor())
        );

    }

    public static SimpleBookResponseDTO simpleBookResponseDTOFromBook(Book book) {
        return new SimpleBookResponseDTO(
                book.getId(),
                book.getTitle(),
                authorInnerResponseDTOFromAuthor(book.getAuthor()),
                book.getGenres().stream().map(BookConverter::simpleGenreResponseDTOFromGenre).collect(Collectors.toList()),
                book.getReleaseDate()
        );
    }

    public static AuthorInnerResponseDTO authorInnerResponseDTOFromAuthor(Author author) {
        return new AuthorInnerResponseDTO(
                author.getId(),
                author.getName(),
                author.getSurname()
        );
    }

    public static SimpleGenreResponseDTO simpleGenreResponseDTOFromGenre(Genre genre) {
        return new SimpleGenreResponseDTO(
                genre.getId(),
                genre.getNameCode(),
                genre.getName());
    }

    public static BookshelfResponseDTO bookshelfResponseDTOFromBookshelf(Bookshelf bookshelf) {
        if (bookshelf == null) {
            return new BookshelfResponseDTO();
        }
        return new BookshelfResponseDTO(
                bookshelf.getId(),
                bookshelf.getLocationLat(),
                bookshelf.getLocationLong(),
                bookshelf.getBooksOnShelf().size(),
                null,
                bookshelf.getVersion());
    }

    public static BookshelfResponseDTO bookshelfResponseDTOFromBookshelf(Bookshelf bookshelf, Double distance) {
        return new BookshelfResponseDTO(
                bookshelf.getId(),
                bookshelf.getLocationLat(),
                bookshelf.getLocationLong(),
                bookshelf.getBooksOnShelf().size(),
                distance,
                bookshelf.getVersion());
    }
}
