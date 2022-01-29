package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ModifyBookRequestDTO {
    private Long id;
    private String title;
    private Long author;
    private List<Long> genres;
    private Integer releaseDate;
    private Long version;
}
