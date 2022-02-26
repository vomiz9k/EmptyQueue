package com.emptyqueue.backend;

import com.emptyqueue.backend.Queue;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/queue")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*", allowCredentials = "true")
public class QueueController {

    private final QueueRepository queueRepository;

    public QueueController(QueueRepository queueRepository) {
        this.queueRepository = queueRepository;
    }

    @GetMapping
    public ResponseEntity getQueues(Principal principal) {
        if (principal == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(queueRepository.findAllByOwner(principal.getName()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity getQueue(@PathVariable Long id, Principal principal) {
        var queue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
        if (principal == null || principal.getName() != queue.getOwner()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(queue);
    }


    @PostMapping
    public ResponseEntity createQueue(@RequestBody Queue queue, Principal principal) throws URISyntaxException {
        if (principal == null) {
            return ResponseEntity.badRequest().build();
        }
        queue.setOwner(principal.getName());
        Queue savedQueue = queueRepository.save(queue);
        return ResponseEntity.created(new URI("/queue/" + savedQueue.getId())).body(savedQueue);
    }

    @PostMapping("/{id}")
    public ResponseEntity editQueue(@PathVariable Long id, @RequestBody Queue queue, Principal principal) throws URISyntaxException {
        var currentQueue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
        if (principal == null || principal.getName() != currentQueue.getOwner()) {
            return ResponseEntity.badRequest().build();
        }
        currentQueue.setName(queue.getName());
        currentQueue.setParticipants(queue.getParticipants());
        currentQueue.setCurrent(0);
        currentQueue = queueRepository.save(currentQueue);

        return ResponseEntity.ok(currentQueue);
    }

    @PutMapping("/{id}")
    public ResponseEntity iterateQueue(@PathVariable Long id, Principal principal) {
        Queue currentQueue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
        if (principal == null || principal.getName() != currentQueue.getOwner()) {
            return ResponseEntity.badRequest().build();
        }        
        currentQueue.iterate();
        currentQueue = queueRepository.save(currentQueue);

        return ResponseEntity.ok(currentQueue);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteQueue(@PathVariable Long id, Principal principal) {
        Queue currentQueue = queueRepository.findById(id).orElseThrow(RuntimeException::new);
        if (principal == null || principal.getName() != currentQueue.getOwner()) {
            return ResponseEntity.badRequest().build();
        } 
        queueRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
