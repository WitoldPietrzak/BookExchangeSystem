package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "book_story_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookStory extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "book_story_generator")
    @SequenceGenerator(name="book_story_generator", sequenceName = "book_story_seq", allocationSize = 1)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "book", referencedColumnName = "id")
    private BookCopy book;
    @Enumerated(EnumType.STRING)
    BookActionType action;
    Double lat1;
    Double lng1;
    Double lat2;
    Double lng2;

    public BookStory(BookCopy book, BookActionType action) {
        this.book = book;
        this.action = action;
    }

    public BookStory(BookCopy book, BookActionType action, Double lat1, Double lng1) {
        this.book = book;
        this.action = action;
        this.lat1 = lat1;
        this.lng1 = lng1;
    }

    public BookStory(BookCopy book, BookActionType action, Double lat1, Double lng1, Double lat2, Double lng2) {
        this.book = book;
        this.action = action;
        this.lat1 = lat1;
        this.lng1 = lng1;
        this.lat2 = lat2;
        this.lng2 = lng2;
    }
}
