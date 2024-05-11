package com.calendly.daos;

import com.calendly.repositories.TokenRepository;
import com.calendly.entities.Token;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class TokenDAO {
    private final TokenRepository tokenRepository;

    public TokenDAO(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public void addToken(Token token) {
        tokenRepository.save(token);
    }

    public Optional<Token> getTokenById(Integer userID) {
        return tokenRepository.findById(userID);
    }

    public Optional<Token> getTokenByContent(String token) {
        return tokenRepository.findByContent(token);
    }
    public void deleteByContent(String tokenContent) {
         tokenRepository.deleteByContent(tokenContent);
    }

    public void deleteAllTokens(Integer userID) {
        tokenRepository.deleteAllByUserID(userID);
    }
}
