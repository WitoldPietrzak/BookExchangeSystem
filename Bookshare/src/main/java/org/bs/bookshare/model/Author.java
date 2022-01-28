package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "author_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Author extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "author_generator")
    @SequenceGenerator(name="author_generator", sequenceName = "author_seq", allocationSize = 1)
    private Long id;
    private String name;
    private String surname;
    @OneToMany(mappedBy = "author")
    private List<Book> books;

    public Author(String name, String surname) {
        this.name = name;
        this.surname = surname;
    }
}
