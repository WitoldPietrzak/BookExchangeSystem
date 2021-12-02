package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "book_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    String title;
    String author;
    @ManyToMany(fetch = FetchType.EAGER)
    List<Genre> genres = new LinkedList<>();
    String releaseDate;
//    @OneToMany(fetch = FetchType.EAGER)
//    List<BookCopy> bookList = new LinkedList<>();

}
