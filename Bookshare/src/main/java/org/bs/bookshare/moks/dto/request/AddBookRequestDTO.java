package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AddBookRequestDTO {
    private String title;
    private String author;
    private List<Long> genres;
    private int releaseDate;

}
