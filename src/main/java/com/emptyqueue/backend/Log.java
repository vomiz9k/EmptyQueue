package com.emptyqueue.backend;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.LinkedList;
import java.util.List;
import com.emptyqueue.backend.Queue;

import java.time.format.DateTimeFormatter;  
import java.time.LocalDateTime; 

@Entity
@Table(name = "Logs")
public class Log {
    @Id
    @GeneratedValue
    private Long id;

    public Long qid;
    private LocalDateTime time;
    private String changer;
    private String what;
    private static DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");  

    public Log(Queue queue, String what) {
        this.time = LocalDateTime.now();  
        this.changer = queue.getParticipants()[queue.getCurrent()];
        this.qid = queue.getId();
        this.what = what;
    }

    public Log() {}

    public Long getQid() {
        return qid;
    }
    public void setQid(Long qid) {
        this.qid = qid;
    }

    public String toString() {
        return this.changer + " " + this.what + " at " + dtf.format(this.time);
    }
}
