package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class AddBookRequestDTO {
    private String title;
    private Long author;
    private List<Long> genres;
    private Integer releaseDate;

}
