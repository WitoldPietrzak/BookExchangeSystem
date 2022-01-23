package org.bs.bookshare.mop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoveBookshelfRequestDTO {
    Long shelfId;
    Double lat;
    Double lng;
    Long version;
}
