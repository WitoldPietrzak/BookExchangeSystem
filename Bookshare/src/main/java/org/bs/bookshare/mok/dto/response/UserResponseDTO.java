package org.bs.bookshare.mok.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String login;
    private String email;
    private Long version;
    private String language;


    //TODO dodać książki ?
}
