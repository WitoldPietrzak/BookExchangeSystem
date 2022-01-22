package org.bs.bookshare.mok.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.model.AppUser;
import org.bs.bookshare.model.Roles;
import org.bs.bookshare.mok.dto.request.CreateUserRequestDTO;
import org.bs.bookshare.mok.dto.request.LanguageChangeRequestDTO;
import org.bs.bookshare.mok.dto.request.PasswordResetRequestDTO;
import org.bs.bookshare.mok.dto.request.RefreshTokenRequestDTO;
import org.bs.bookshare.mok.dto.request.UsersFilterRequestDTO;
import org.bs.bookshare.mok.dto.response.MessageResponseDTO;
import org.bs.bookshare.mok.dto.request.PasswordChangeRequestDTO;
import org.bs.bookshare.mok.dto.response.RefreshResponseDTO;
import org.bs.bookshare.mok.dto.response.UserListElementResponseDTO;
import org.bs.bookshare.mok.dto.response.UserListResponseDTO;
import org.bs.bookshare.mok.dto.response.UserResponseDTO;
import org.bs.bookshare.mok.service.AppUserService;
import org.bs.bookshare.mok.dto.request.RoleToUserRequestDTO;
import org.bs.bookshare.utils.converter.UserConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import static org.bs.bookshare.common.Codes.ACCOUNT_CREATED_MESSAGE;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AppUserController {
    private final AppUserService userService;

    @RolesAllowed({Roles.ROLE_ADMIN})
    @GetMapping("/all")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok().body(new UserListResponseDTO(userService.getAllUsers().stream().map(UserConverter::userListResponseDTOFromUser).collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_ADMIN})
    @PostMapping("/all")
    public ResponseEntity<?> getFilteredUsers(@RequestBody UsersFilterRequestDTO filterRequestDTO) {
        return ResponseEntity.ok().body(new UserListResponseDTO(userService.getFilteredUsers(filterRequestDTO.getLogin(), filterRequestDTO.getEmail()).stream().map(UserConverter::userListResponseDTOFromUser).collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_ADMIN})
    @GetMapping("/info/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@NotNull @PathVariable("id") Long id) throws AppUserException {
        AppUser user = userService.getUser(id);
        return ResponseEntity.ok().body(UserConverter.adminUserResponseDTOFromUser(user));
    }

    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_ADMIN, Roles.ROLE_MODERATOR})
    @GetMapping("/info")
    public ResponseEntity<UserResponseDTO> getUser(Principal principal) throws AppUserException {
        String login = principal.getName();
        AppUser user = userService.getUser(login);
        return ResponseEntity.ok().body(UserConverter.userResponseDTOFromUser(user));
    }

    @PermitAll
    @PostMapping("/register")
    public ResponseEntity<?> saveUser(@RequestBody CreateUserRequestDTO dto) throws AppUserException {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/account/register").toUriString());
        userService.createUser(dto.getLogin(), dto.getEmail(), dto.getPassword(), dto.getLanguage());
        return ResponseEntity.created(uri).body(new MessageResponseDTO(ACCOUNT_CREATED_MESSAGE));

    }

    @PostMapping("/role/add")
    @RolesAllowed({Roles.ROLE_ADMIN})
    public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserRequestDTO role) throws AppUserException {
        userService.addRoleToUser(role.getUserId(), role.getRoleName());
        return ResponseEntity.ok().build();

    }

    @PostMapping("/role/revoke")
    @RolesAllowed({Roles.ROLE_ADMIN})
    public ResponseEntity<?> revokeRoleFromUser(@RequestBody RoleToUserRequestDTO role) throws AppUserException {
        userService.revokeRoleFromUser(role.getUserId(), role.getRoleName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/password")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_MODERATOR, Roles.ROLE_ADMIN})
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody PasswordChangeRequestDTO dto) throws AppUserException {
        String login = principal.getName();
        userService.changePassword(login, dto.getOldPassword(), dto.getNewPassword(), dto.getNewPasswordMatch());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/disable/{id}")
    @RolesAllowed({Roles.ROLE_ADMIN})
    public ResponseEntity<?> disableUser(Principal principal, @PathVariable Long id) throws AppUserException {
        userService.disableUser(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/enable/{id}")
    @RolesAllowed({Roles.ROLE_ADMIN})
    public ResponseEntity<?> enableUser(Principal principal, @PathVariable Long id) throws AppUserException {
        userService.enableUser(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/language")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_ADMIN, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> changeLanguage(Principal principal, @RequestBody LanguageChangeRequestDTO dto) throws AppUserException {
        userService.changeLanguage(principal.getName(), dto.getLanguage());
        return ResponseEntity.ok().build(); //TODO zwracanie wiadomosci o sukcesie?
    }

    @GetMapping("/activate/{token}")
    @PermitAll
    public ResponseEntity<?> activateUser(@PathVariable String token) throws AppUserException {
        userService.activateUser(token);
        return ResponseEntity.ok().build(); //TODO zwracanie wiadomosci o sukcesie?
    }

    @PostMapping("/password/{token}")
    @PermitAll
    public ResponseEntity<?> resetPassword(@PathVariable String token, @RequestBody PasswordResetRequestDTO dto) throws AppUserException {
        userService.resetPassword(token, dto.getNewPassword(), dto.getNewPasswordConfirm());
        return ResponseEntity.ok().build(); //TODO zwracanie wiadomosci o sukcesie?
    }

    @GetMapping("/password/{token}")
    @PermitAll
    public ResponseEntity<?> verifyPasswordToken(@PathVariable String token) throws AppUserException {
        userService.verifyPasswordResetToken(token);
        return ResponseEntity.ok().build(); //TODO zwracanie wiadomosci o sukcesie?
    }

    @GetMapping("/password/reset/{loginOrEmail}")
    @PermitAll
    public ResponseEntity<?> requestPasswordReset(@PathVariable String loginOrEmail) throws AppUserException {
        userService.sendResetPasswordRequest(loginOrEmail);
        return ResponseEntity.ok().build(); //TODO zwracanie wiadomosci o sukcesie?
    }

    @GetMapping("/enable/token/{token}")
    @PermitAll
    public ResponseEntity<?> enableUserByToken(@PathVariable String token) throws AppUserException {
        userService.enableUserByToken(token);
        return ResponseEntity.ok().build(); //TODO zwracanie wiadomosci o sukcesie?
    }

    @PostMapping("/refresh")
    @RolesAllowed({Roles.ROLE_USER, Roles.ROLE_ADMIN, Roles.ROLE_MODERATOR})
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequestDTO jwt) throws AppUserException {
        Map<String, Object> tokens = userService.refreshToken(jwt.getToken());
        return ResponseEntity.ok().body(new RefreshResponseDTO((String) tokens.get("refreshToken"), (String) tokens.get("accessToken"), (List<String>) tokens.get("roles")));
    }

    @GetMapping("/ready")
    @PermitAll
    public ResponseEntity<?> readinessCheck() {
        return ResponseEntity.ok().build();
    }


}
