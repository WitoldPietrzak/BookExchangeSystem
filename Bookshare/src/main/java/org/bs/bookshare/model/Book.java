package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.time.LocalDateTime;
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
    private Long id;
    private String title;
    @ManyToOne
    @JoinColumn(name = "author")
    private Author author;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "book_table_genres",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "genres_id")
    )
    private List<Genre> genres = new LinkedList<>();
    //    @OneToMany(fetch = FetchType.LAZY)
//    List<BookReview> reviews = new LinkedList<>();
    @OneToMany(mappedBy = "book")
    private List<BookCopy> copies;
    private Integer releaseDate;

    public Book(String title, Author author, List<Genre> genres, Integer releaseDate) {
        this.title = title;
        this.author = author;
        this.genres = genres;
        this.releaseDate = releaseDate;
    }
}
