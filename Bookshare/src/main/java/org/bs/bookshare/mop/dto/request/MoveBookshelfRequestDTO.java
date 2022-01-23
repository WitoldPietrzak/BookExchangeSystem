package org.bs.bookshare.mop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoveBookshelfRequestDTO {
    private Long shelfId;
    private Double lat;
    private Double lng;
    private Long version;
}
