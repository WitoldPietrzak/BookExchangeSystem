package org.bs.bookshare.mok.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.Email;

@AllArgsConstructor
@Data
public class CreateUserRequestDTO {
    private String login;
    private String email;
    private String password;
    private String language;
}
