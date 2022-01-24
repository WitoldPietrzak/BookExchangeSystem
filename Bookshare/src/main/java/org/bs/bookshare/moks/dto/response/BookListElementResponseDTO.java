package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BookListElementResponseDTO {
    private Long id;
    private String title;
    private AuthorInnerResponseDTO author;
    private List<SimpleGenreResponseDTO> genres;
    private Integer releaseDate;
    private Integer copyCount;
}
