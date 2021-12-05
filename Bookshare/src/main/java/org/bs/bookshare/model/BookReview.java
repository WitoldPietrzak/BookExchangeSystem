package org.bs.bookshare.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "book_review_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookReview extends AbstractEntity {
    @Id
    Long Id;
    Boolean anonymous;
    String review;
    Long rating;



}
