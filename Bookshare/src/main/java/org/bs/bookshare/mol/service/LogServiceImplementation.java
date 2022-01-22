package org.bs.bookshare.mol.service;

import lombok.RequiredArgsConstructor;
import org.bs.bookshare.mol.repositories.LogRepository;
import org.bs.bookshare.model.Log;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LogServiceImplementation implements LogService{

    private final LogRepository logRepository;
    private final EntityManager entityManager;
    @Override
    public List<Log> getAllLogs() {
        return logRepository.findAll();
    }

    @Override
    public List<Log> getFilteredLogs(String level, LocalDateTime after, LocalDateTime before) {
        return logRepository.findAllFilterByD(level,after,before);
    }
}
