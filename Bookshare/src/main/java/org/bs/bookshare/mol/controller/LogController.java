package org.bs.bookshare.mol.controller;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.mol.DTO.LogFilteredRequestDTO;
import org.bs.bookshare.mol.DTO.LogResponseDTO;
import org.bs.bookshare.mol.DTO.LogsResponseDTO;
import org.bs.bookshare.mol.service.LogService;
import org.bs.bookshare.model.Roles;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;


    @RolesAllowed({Roles.ROLE_ADMIN})
    @GetMapping("/all")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok().body(new LogsResponseDTO(logService.getAllLogs().stream().map(log -> {
            return new LogResponseDTO(log.getEventDate(), log.getLogger(), log.getLevel(), log.getMessage(), log.getException());
        }).collect(Collectors.toList())));
    }

    @RolesAllowed({Roles.ROLE_ADMIN})
    @PostMapping("/all")
    public ResponseEntity<?> getUsers(@RequestBody LogFilteredRequestDTO dto) {
        return ResponseEntity.ok().body(new LogsResponseDTO(logService.getFilteredLogs(dto.getLevel(), dto.getAfter(), dto.getBefore()).stream().map(log -> {
            return new LogResponseDTO(log.getEventDate(), log.getLogger(), log.getLevel(), log.getMessage(), log.getException());
        }).collect(Collectors.toList())));
    }

}
