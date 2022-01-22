package org.bs.bookshare.logging.service;

import org.bs.bookshare.model.Log;

import java.time.LocalDateTime;
import java.util.List;

public interface LogService {

    List<Log>getAllLogs();

    List<Log>getFilteredLogs(String level, LocalDateTime after, LocalDateTime before);
}
