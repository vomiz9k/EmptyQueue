package com.emptyqueue.backend;

import com.github.javafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import javax.transaction.Transactional;
import java.util.Locale;

@Component
public class BoostrapInitialData implements CommandLineRunner {

    private final QueueRepository QueueRepository;
    private final Faker faker = new Faker(Locale.getDefault());

    public BoostrapInitialData(QueueRepository QueueRepository) {
        this.QueueRepository = QueueRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        for (int i = 0; i < 10; i++) {
            String[] arr = new String[3];
            for (int j = 0; j < 3; ++j) {
                arr[j] = new String(faker.name().fullName());
            }
            QueueRepository.save(new Queue(faker.name().fullName(), arr, "user2"));
        }
    }
}
