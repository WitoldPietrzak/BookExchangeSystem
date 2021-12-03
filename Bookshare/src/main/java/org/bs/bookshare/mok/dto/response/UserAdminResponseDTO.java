package org.bs.bookshare.mok.dto.response;

import org.bs.bookshare.model.AppRole;

import java.util.List;
import java.util.stream.Collectors;

public class UserAdminResponseDTO extends UserResponseDTO {
    private boolean activated;
    private boolean disabled;
    private List<SimpleRoleResponseDTO> roles;

    public UserAdminResponseDTO(Long id, String login, String email, boolean activated, boolean disabled, Long version, List<AppRole> roles) {
        super(id, login, email, version);
        this.activated = activated;
        this.disabled = disabled;
        this.roles = roles.stream().map(role -> {
            return new SimpleRoleResponseDTO(role.getName());
        }).collect(Collectors.toList());
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public boolean isDisabled() {
        return disabled;
    }

    public void setDisabled(boolean disabled) {
        this.disabled = disabled;
    }

    public List<SimpleRoleResponseDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<SimpleRoleResponseDTO> roles) {
        this.roles = roles;
    }
}
