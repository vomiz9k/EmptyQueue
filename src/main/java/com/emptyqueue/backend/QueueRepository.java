package com.emptyqueue.backend;

import com.emptyqueue.backend.Queue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QueueRepository extends JpaRepository<Queue, Long> {
    List<Queue> findAllByOwner(String owner);
}


