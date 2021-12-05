package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "user_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUser extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String login;
    @Email
    private String email;
    private String password;
    @Column(nullable = false)
    private Boolean activated = false;
    @Column(nullable = false)
    private Boolean disabled = false;
    private LocalDateTime lastSuccessfulLogin;
    private String lastSuccessfulLoginIp;
    private LocalDateTime lastUnsuccessfulLogin;
    private String lastUnsuccessfulLoginIp;
    private Integer loginAttempts = 0;
//    List<BookCopy> possessedBooks;
    @ManyToMany(fetch = FetchType.LAZY)
    private List<AppRole> appRoles = new LinkedList<>();
    private String language;
    public AppUser(String login, String email, String password, String language) {
        super();
        this.login = login;
        this.email = email;
        this.password = password;
        this.language = language;
    }
}
