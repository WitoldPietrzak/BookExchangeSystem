package org.bs.bookshare.utils.converter;

import org.bs.bookshare.model.AppRole;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.mok.dto.request.CreateUserRequestDTO;
import org.bs.bookshare.mok.dto.response.SimpleRoleResponseDTO;
import org.bs.bookshare.mok.dto.response.UserListResponseDTO;
import org.bs.bookshare.mok.dto.response.UserResponseDTO;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

public class UserConverter {
    public static AppUser userFromCreateUserRequestDTO(CreateUserRequestDTO dto) {
        return new AppUser(dto.getLogin(), dto.getEmail(), dto.getPassword(), dto.getLanguage().toLowerCase());
    }

    public static UserListResponseDTO userListResponseDTOFromUser(AppUser user) {
        return new UserListResponseDTO(user.getId(), user.getLogin(), user.getEmail());
    }

    public static UserResponseDTO userResponseDTOFromUser(AppUser user) {
        return new UserResponseDTO(user.getId(), user.getLogin(), user.getEmail(), user.getVersion(), user.getLanguage(),user.getActivated(),user.getDisabled(),user.getAppRoles().stream().map(AppRole::getName).collect(Collectors.toList()),user.getLastSuccessfulLogin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),user.getCreationDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }
}
