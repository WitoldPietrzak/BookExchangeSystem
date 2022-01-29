package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.model.CoverType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddBookCopyRequestDTO {
    private Long bookId;
    private CoverType coverType;
    private String language;

}
