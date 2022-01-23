package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimpleBookCopyRequestDTO {
    private Long bookCopyId;
    private Long version;
}
