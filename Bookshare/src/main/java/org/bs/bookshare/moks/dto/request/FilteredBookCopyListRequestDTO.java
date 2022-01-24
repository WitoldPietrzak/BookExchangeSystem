package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.model.CoverType;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilteredBookCopyListRequestDTO {
    private Long book;
    private String title;
    private Long author;
    private List<Long> genres;
    private Integer releasedBefore;
    private Integer releasedAfter;
    private String language;
    private CoverType coverType;
    private Boolean availability;
    private Double lat;
    private Double lng;
    private Double distance;
}
