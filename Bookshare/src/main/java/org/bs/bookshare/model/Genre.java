package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "genre_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Genre extends AbstractEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    String name;

    public Genre(String name) {
        this.name = name;
    }
}
