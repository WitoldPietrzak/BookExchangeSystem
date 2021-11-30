package org.bs.bookshare.model;

import java.time.LocalDateTime;
import java.util.List;

public class User {
    private String login;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean activated;
    private Boolean disabled;
    private LocalDateTime lastSuccessfulLogin;
    private String lastSuccessfulLoginIp;
    private LocalDateTime lastUnsuccessfulLogin;
    private String lastUnsuccessfulLoginIp;
    private Integer loginAttempts;
    List<BookCopy> possessedBooks;
}
