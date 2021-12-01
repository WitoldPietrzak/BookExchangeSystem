package org.bs.bookshare.mok.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CreateUserRequestDTO {
    private String login;
    private String email;
    private String password;
}
