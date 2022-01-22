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
    String lastSuccessfulLoginIp;
    String lastUnsuccessfulLoginAttemptDateTime;
    String modificationDateTime;
    String lastUnsuccessfulLoginIp;


    public UserResponseDTO(Long id, String login, String email, Long version, String language, boolean activated, boolean disabled, List<String> roles, String lastSuccessfulLoginAttemptDateTime, String creationDateTime) {
        this.id = id;
        this.login = login;
        this.email = email;
        this.version = version;
        this.language = language;
        this.activated = activated;
        this.disabled = disabled;
        this.roles = roles;
        this.lastSuccessfulLoginAttemptDateTime = lastSuccessfulLoginAttemptDateTime;
        this.creationDateTime = creationDateTime;
    }

    //TODO dodać książki ?
}
