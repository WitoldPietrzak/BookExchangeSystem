package org.bs.bookshare.mok.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserListResponseDTO {
    private Long id;
    private String login;
    private String email;
}
