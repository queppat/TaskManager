package com.taskmanager.service;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskmanager.exception.InvalidRefreshTokenException;
import com.taskmanager.exception.UserExistException;
import com.taskmanager.exception.UserNotFoundException;
import com.taskmanager.exception.WrongParamException;
import com.taskmanager.model.domain.User;
import com.taskmanager.model.dto.entity.TokenDTO;
import com.taskmanager.model.dto.request.LoginRequest;
import com.taskmanager.model.dto.request.RegisterRequest;
import com.taskmanager.model.enums.Role;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.utils.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public TokenDTO registerUser(RegisterRequest registerRequest) {

        if(registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()){
            throw new WrongParamException("Email cannot be empty");
        }

        if (Boolean.TRUE.equals(userRepository.existsByEmail(registerRequest.getEmail()))) {
            throw new UserExistException("User already exist");
        }

        User user = User.builder()
            .email(registerRequest.getEmail().toLowerCase().trim())
            .username(registerRequest.getUsername())
            .password(passwordEncoder.encode(registerRequest.getPassword()))
            .roles(Set.of(Role.USER))
            .build();

        User savedUser = userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getUsername(),
            savedUser.getRoles(),
            true
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getEmail());

        log.info("(registerUser) User registered successfully: {}", registerRequest.getEmail());
        return TokenDTO.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }

    public TokenDTO loginUser(LoginRequest loginRequest) {

        if(loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()){
            throw new WrongParamException("Email cannot be empty");
        }

        if (Boolean.FALSE.equals(userRepository.existsByEmail(loginRequest.getEmail()))) {
            throw new UserNotFoundException("User for login not found");
        }

        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(()-> new UserNotFoundException("User not found"));

        boolean isCorrect = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());

        if (!isCorrect) {
            throw new WrongParamException("Invalid password");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getRoles(),
            false
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        log.info("(loginUser) User registered successfully: {}", loginRequest.getEmail());
        return TokenDTO.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }

    public TokenDTO refreshTokens(String refreshToken){
        
        if(refreshToken == null || refreshToken.trim().isEmpty()){
            throw new WrongParamException("Refresh token cannot be empty");
        }

        if(!jwtTokenProvider.validateRefreshToken(refreshToken)){
            throw new InvalidRefreshTokenException("Invalid refresh token");
        }

        
        String email = jwtTokenProvider.getEmailFromRefreshToken(refreshToken);
        
        userDetailsServiceImpl.loadUserByUsername(email);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        String newAccessToken = jwtTokenProvider.generateAccessToken(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getRoles(),
            false
        );

        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        log.info("(refreshTokens) User tokens refresh successfully: {}", user.getEmail());
        return TokenDTO.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .build();

    }

}
