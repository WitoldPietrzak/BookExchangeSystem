package org.bs.bookshare.mop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookshelfResponseDTO {
    private Long id;
    private Double latitude;
    private Double longitude;
    private Integer bookCount;
    private Double distance;
    private Long version;
}
