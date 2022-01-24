package org.bs.bookshare.moks.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeleteEntityRequestDTO {
    private Long id;
    private Long version;
}
