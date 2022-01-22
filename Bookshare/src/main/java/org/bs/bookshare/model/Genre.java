package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapKey;
import javax.persistence.MapKeyColumn;
import javax.persistence.Table;
import java.util.Map;

@Entity
@Table(name = "genre_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Genre extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String nameCode;

    @ElementCollection
    @CollectionTable(
            name = "genre_translations_table",
            joinColumns =
                    {@JoinColumn(
                            name = "genre",
                            referencedColumnName = "id")})
    @MapKeyColumn(name = "language")
    @Column(name = "translation")
    private Map<String, String> name;

    public Genre(String nameCode, Map<String, String> name) {
        this.nameCode = nameCode;
        this.name = name;
    }
}
