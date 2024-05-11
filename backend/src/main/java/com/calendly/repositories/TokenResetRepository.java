package com.calendly.repositories;

import com.calendly.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenResetRepository extends JpaRepository<PasswordResetToken, Integer> {

    PasswordResetToken findByUserEmail(String email);

    PasswordResetToken findByToken(String token);

}