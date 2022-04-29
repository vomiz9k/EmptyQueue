package com.emptyqueue.backend;

import com.emptyqueue.backend.Log;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository extends JpaRepository<Log, Long> {
    List<Log> findAllByQid(Long queueId);
}


