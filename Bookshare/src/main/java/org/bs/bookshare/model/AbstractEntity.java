package org.bs.bookshare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bs.bookshare.utils.IpAddressRetriever;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Version;
import java.time.LocalDateTime;

@MappedSuperclass
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AbstractEntity {
    @Version
    private Long version;
    private LocalDateTime creationDateTime;
    private LocalDateTime modificationDateTime;
    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "id")
    private AppUser createdBy;
    @ManyToOne
    @JoinColumn(name = "modified_by", referencedColumnName = "id")
    private AppUser modifiedBy;
    private String createdByIp;
    private String modifiedByIp;


    @PrePersist
    private void init() {

        creationDateTime = LocalDateTime.now();
        createdByIp = IpAddressRetriever.getClientIpAddressFromHttpServletRequest();

    }

    @PreUpdate
    private void initUpdate() {
        modificationDateTime = LocalDateTime.now();
        modifiedByIp = IpAddressRetriever.getClientIpAddressFromHttpServletRequest();
    }
}
