package com.emptyqueue.backend;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Queues")
public class Queue {
    @Id
    @GeneratedValue
    private Long id;

    private String owner;
    private String name;
    private String[] participants;
    private int current;

    public Queue() {
    }

    public Queue(String name, String[] participants, String owner) {
        this.name = name;
        this.participants = participants;
        this.current = 0;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String[] getParticipants() {
        return participants;
    }

    public void setParticipants(String[] participants) {
        this.participants = participants;
    }

    public int getCurrent() {
        return current;
    }

    public void iterate() {
        current = (current + 1) % participants.length;
    }

    public void setCurrent(int curr) {
        this.current = curr;
    }
}
