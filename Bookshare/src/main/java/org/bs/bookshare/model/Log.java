package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Log {

    @Id
    private Long id;
    @Column(name = "eventdate")
    private LocalDateTime eventDate;
    private String logger;
    private String level;
    private String message;
    private String exception;
}
