package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookCopyListElementResponseDTO {
    private Long id;
    private String title;
    private AuthorInnerResponseDTO author;
    private Boolean available;
    private Double distance;
    private String cover;
    private String language;
    private List<SimpleGenreResponseDTO> genres;
    private Integer releaseDate;

    public BookCopyListElementResponseDTO(Long id, String title, AuthorInnerResponseDTO author, Boolean available, String cover, String language, List<SimpleGenreResponseDTO> genres, Integer releaseDate) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.available = available;
        this.distance = null;
        this.cover = cover;
        this.language = language;
        this.genres = genres;
        this.releaseDate = releaseDate;
    }
}
