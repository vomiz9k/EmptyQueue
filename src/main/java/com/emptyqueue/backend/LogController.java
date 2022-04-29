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
@RequestMapping("/log")
@CrossOrigin(methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*")
public class LogController {

    private final LogRepository logRepository;

    public LogController(LogRepository logRepository) {
        this.logRepository = logRepository;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity getLogs(@PathVariable Long id) {
        List<Log> logs = logRepository.findAllByQid(id);
        String[] logs_str = new String[logs.size()];
        int i = logs.size() - 1;
        for(var log: logs) {
            logs_str[i] = log.toString();
            i -= 1;
        }
        return ResponseEntity.ok(logs_str);
    }

}
