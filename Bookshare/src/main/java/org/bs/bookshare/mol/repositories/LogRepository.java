package org.bs.bookshare.mol.repositories;

import org.bs.bookshare.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface LogRepository extends JpaRepository<Log, Long> {

    @Query("SELECT DISTINCT log FROM Log log WHERE " +
            "((:level) is NULL or log.level LIKE :level) " +
            "AND (cast(:after as date) is NULL or log.eventDate > :after) " +
            "AND (cast(:before as date) is NULL or log.eventDate < :before) ")
    List<Log> findAllFilterByD(@Param("level") String level, @Param("after")LocalDateTime after,@Param("before") LocalDateTime before);
}
