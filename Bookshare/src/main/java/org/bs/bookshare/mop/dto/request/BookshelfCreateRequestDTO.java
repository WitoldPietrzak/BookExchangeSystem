package org.bs.bookshare.mop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookshelfCreateRequestDTO {
    private Double latitude;
    private Double longitude;

}
