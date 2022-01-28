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
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.LinkedList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bookshelf_table")
public class Bookshelf extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bookshelf_generator")
    @SequenceGenerator(name="bookshelf_generator", sequenceName = "bookshelf_seq", allocationSize = 1)
    private Long id;
    @NotNull
    private Double locationLat;
    @NotNull
    private Double locationLong;
    @OneToMany(mappedBy = "bookshelf")
    private List<BookCopy> booksOnShelf = new LinkedList<>();

    public Bookshelf(Double locationLat, Double locationLong) {
        this.locationLat = locationLat;
        this.locationLong = locationLong;
    }
}
