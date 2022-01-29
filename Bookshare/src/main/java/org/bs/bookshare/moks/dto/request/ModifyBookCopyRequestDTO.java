package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.bs.bookshare.model.CoverType;

@Data
@AllArgsConstructor
public class ModifyBookCopyRequestDTO {
    private Long id;
    private Long bookId;
    private CoverType coverType;
    private String language;
    private Long version;

}
