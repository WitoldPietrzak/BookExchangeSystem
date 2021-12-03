package org.bs.bookshare.mok.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.dto.request.CreateUserRequestDTO;
import org.bs.bookshare.mok.dto.response.MessageResponseDTO;
import org.bs.bookshare.mok.dto.request.PasswordChangeRequestDTO;
import org.bs.bookshare.mok.dto.response.UserListResponseDTO;
import org.bs.bookshare.mok.dto.response.UserResponseDTO;
import org.bs.bookshare.mok.service.AppUserService;
import org.bs.bookshare.mok.dto.request.AddRoleToUserRequestDTO;
import org.bs.bookshare.utils.converter.UserConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AppUserController {
    private final AppUserService userService;

    @RolesAllowed({Roles.ROLE_ADMIN})
    @GetMapping("/all")
    public ResponseEntity<List<UserListResponseDTO>> getUsers() {
        return ResponseEntity.ok().body(userService.getAllUsers().stream().map(UserConverter::userListResponseDTOFromUser).collect(Collectors.toList()));
    }

    @RolesAllowed({Roles.ROLE_ADMIN})
    @GetMapping("/info/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@NotNull @PathVariable("id") Long id) {
        //TODO
        AppUser user = userService.getUser(id);
        return ResponseEntity.ok().body(UserConverter.userAdminResponseDTOFromUser(user));
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_ADMIN, Roles.ROLE_MODERATOR})
    @GetMapping("/info")
    public ResponseEntity<UserResponseDTO> getUser(Principal principal) {
        //TODO
        String login = principal.getName();
        AppUser user = userService.getUser(login);
        return ResponseEntity.ok().body(UserConverter.userResponseDTOFromUser(user));
    }

    @PermitAll
    @PostMapping("/register")
    public ResponseEntity<MessageResponseDTO> saveUser(@RequestBody CreateUserRequestDTO user) throws AppUserException {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/account/register").toUriString());
        userService.createUser(UserConverter.userFromCreateUserRequestDTO(user));
        return ResponseEntity.created(uri).body(new MessageResponseDTO("Konto utworzone pomyślnie"));  //TODO

    }

    @PostMapping("/role")
    @RolesAllowed({Roles.ROLE_ADMIN})
    public ResponseEntity<AddRoleToUserRequestDTO> addRoleToUser(@RequestBody AddRoleToUserRequestDTO role) throws AppUserException {
        userService.addRoleToUser(role.getUserId(), role.getRoleName());
        return ResponseEntity.ok().build();

    }

    @PostMapping("/password")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR, Roles.ROLE_ADMIN})
    public ResponseEntity changePassword(Principal principal, @RequestBody PasswordChangeRequestDTO dto) throws AppUserException {
        String login = principal.getName();
        userService.changePassword(login,dto.getOldPassword(),dto.getNewPassword(), dto.getNewPasswordMatch());
        return ResponseEntity.ok().build();
    }


}
