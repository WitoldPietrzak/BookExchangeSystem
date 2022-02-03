package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "book_copy_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookCopy extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "book_copy_generator")
    @SequenceGenerator(name="book_copy_generator", sequenceName = "book_copy_seq", allocationSize = 1)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "book", referencedColumnName = "id")
    private Book book;
    @ManyToOne
    @JoinColumn(name = "owner")
    private AppUser owner;

    @ManyToOne
    @JoinColumn(name = "bookshelf")
    private Bookshelf bookshelf;
    @ManyToOne
    @JoinColumn(name = "reserved")
    private AppUser reserved;
    private LocalDateTime reservedUntil;
    @Enumerated(EnumType.STRING)
    @Column(name = "cover")
    private CoverType coverType;
    private String language;
    @OneToMany(mappedBy = "book")
    private List<BookStory> story;

    public boolean isAvailable() {
        return bookshelf != null && reserved == null;
    }

    public boolean isAvailableForUser(AppUser user) {
        return bookshelf != null && (reserved == user || reserved == null);
    }

    public BookCopy(Book book, AppUser owner, CoverType coverType, String language) {
        this.book = book;
        this.owner = owner;
        this.coverType = coverType;
        this.language = language;
    }
}
