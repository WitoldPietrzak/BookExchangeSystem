package org.bs.bookshare.moks.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookCopyInnerResponseDTO {
    private Long id;
    private boolean isAvailable;
    private String coverType;
    private String language;
}
