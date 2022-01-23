package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_copy_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookCopy extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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
//    String state;

    public boolean isAvailable() {
        return bookshelf != null && reserved == null;
    }

    public BookCopy(Book book, AppUser owner, CoverType coverType) {
        this.book = book;
        this.owner = owner;
        this.coverType = coverType;
    }
}
