package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SimpleBookResponseDTO {
    Long id;
    String title;
    AuthorInnerResponseDTO author;
    List<SimpleGenreResponseDTO> genres;
    Integer releaseDate;
}
