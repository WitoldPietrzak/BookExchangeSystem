package org.bs.bookshare.mok.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.exceptions.AppUserException;
import org.bs.bookshare.mok.dto.CreateUserRequestDTO;
import org.bs.bookshare.mok.dto.MessageResponseDTO;
import org.bs.bookshare.mok.dto.UserListResponseDTO;
import org.bs.bookshare.mok.service.AppUserService;
import org.bs.bookshare.utils.converter.UserConverter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AppUserController {
    private final AppUserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserListResponseDTO>> getUsers() {
        return ResponseEntity.ok().body(userService.getAllUsers().stream().map(UserConverter::UserListResponseDTOFromUser).collect(Collectors.toList()));
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponseDTO> saveUser(@RequestBody CreateUserRequestDTO user) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/account/register").toUriString());
        try {
            userService.createUser(UserConverter.userFromCreateUserRequestDTO(user));
            return ResponseEntity.created(uri).body(new MessageResponseDTO("Konto utworzone pomyślnie"));  //TODO
        } catch (AppUserException e) {
            return ResponseEntity.badRequest().body(new MessageResponseDTO(e.getMessage()));
        }

    }


}
