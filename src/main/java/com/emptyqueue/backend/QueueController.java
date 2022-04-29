package com.emptyqueue.backend;

import com.emptyqueue.backend.Queue;
import com.emptyqueue.backend.Log;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/queue")
@CrossOrigin(methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*")
public class QueueController {

    private final QueueRepository queueRepository;
    private final LogRepository logRepository;

    public QueueController(QueueRepository queueRepository, LogRepository logRepository) {
        this.queueRepository = queueRepository;
        this.logRepository = logRepository;
    }

    @GetMapping
    public ResponseEntity getQueues() {
        return ResponseEntity.ok(queueRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity getQueue(@PathVariable Long id) {
        var queue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
        return ResponseEntity.ok(queue);
    }


    @PostMapping
    public ResponseEntity createQueue(@RequestBody Queue queue) throws URISyntaxException {
        queue.setOwner("user2");
        Queue savedQueue = queueRepository.save(queue);
        logRepository.save(new Log(savedQueue, "created"));
        return ResponseEntity.created(new URI("/queue/" + savedQueue.getId())).body(savedQueue);
    }

    @PostMapping("/{id}")
    public ResponseEntity editQueue(@PathVariable Long id, @RequestBody Queue queue) throws URISyntaxException {
        var currentQueue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
        logRepository.save(new Log(currentQueue, "edited"));

        currentQueue.setName(queue.getName());
        currentQueue.setParticipants(queue.getParticipants());
        currentQueue.setCurrent(0);
        currentQueue = queueRepository.save(currentQueue);

        return ResponseEntity.ok(currentQueue);
    }

    @PutMapping("/{id}")
    public ResponseEntity iterateQueue(@PathVariable Long id) {
        Queue currentQueue = queueRepository.findById(id).orElseThrow(RuntimeException::new);

        logRepository.save(new Log(currentQueue, "iterated"));
        currentQueue.iterate();
        currentQueue = queueRepository.save(currentQueue);
        
        return ResponseEntity.ok(currentQueue);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteQueue(@PathVariable Long id) {
        Queue currentQueue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
        queueRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
