package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DetailBookResponseDTO {
    Long id;
    String title;
    AuthorInnerResponseDTO author;
    Integer releaseDate;
    List<SimpleGenreResponseDTO> genres;
    List<BookCopyInnerResponseDTO> copies;
    Long version;
}
