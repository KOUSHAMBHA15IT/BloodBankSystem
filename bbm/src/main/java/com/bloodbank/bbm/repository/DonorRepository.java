package com.bloodbank.bbm.repository;

import com.bloodbank.bbm.model.Donor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DonorRepository extends MongoRepository<Donor, String> {
}