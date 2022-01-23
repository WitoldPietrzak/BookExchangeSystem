package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilteredBookListRequestDTO {
    private String title;
    private Long author;
    private List<Long> genres;
    private Integer releasedBefore;
    private Integer releasedAfter;
    private Integer copyCount;
}
