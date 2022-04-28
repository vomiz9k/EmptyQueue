package com.emptyqueue.backend;

import com.emptyqueue.backend.Queue;

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

    public QueueController(QueueRepository queueRepository) {
        this.queueRepository = queueRepository;
    }

    @GetMapping
    public ResponseEntity getQueues() {
        return ResponseEntity.ok(queueRepository.findAllByOwner("user2"));
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
        return ResponseEntity.created(new URI("/queue/" + savedQueue.getId())).body(savedQueue);
    }

    @PostMapping("/{id}")
    public ResponseEntity editQueue(@PathVariable Long id, @RequestBody Queue queue) throws URISyntaxException {
        var currentQueue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
        currentQueue.setName(queue.getName());
        currentQueue.setParticipants(queue.getParticipants());
        currentQueue.setCurrent(0);
        currentQueue = queueRepository.save(currentQueue);

        return ResponseEntity.ok(currentQueue);
    }

    @PutMapping("/{id}")
    public ResponseEntity iterateQueue(@PathVariable Long id) {
        Queue currentQueue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
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
