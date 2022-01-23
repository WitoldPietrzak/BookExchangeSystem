package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    public BookCopyListElementResponseDTO(Long id, String title, AuthorInnerResponseDTO author, Boolean available, String cover) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.available = available;
        this.distance = null;
        this.cover = cover;
    }
}
