package org.bs.bookshare.model;

import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@MappedSuperclass
public class AbstractEntity {
    private Long version;
    private LocalDateTime creationDateTime;
    private LocalDateTime modificationDateTime;
    private User createdBy;
    private User modifiedBy;
    private String createdByIp;
    private String modifiedByIp;
}
