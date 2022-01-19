package org.bs.bookshare.mok.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String login;
    private String email;
    private Long version;
    private String language;
    private boolean activated;
    private boolean disabled;
    private List<String> roles;
    String lastSuccessfulLoginAttemptDateTime;
    String creationDateTime;


    //TODO dodać książki ?
}
