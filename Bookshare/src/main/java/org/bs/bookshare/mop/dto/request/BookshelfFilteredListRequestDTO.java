package org.bs.bookshare.mop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookshelfFilteredListRequestDTO {
    private Double latitude;
    private Double longitude;
    private Double distance;
    private Integer bookCount;
}
