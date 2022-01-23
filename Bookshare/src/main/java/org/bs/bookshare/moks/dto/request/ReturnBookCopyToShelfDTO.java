package org.bs.bookshare.moks.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReturnBookCopyToShelfDTO {
    private Long bookCopyId;
    private Long bookshelfId;
    private Long version;
}
