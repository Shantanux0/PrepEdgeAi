package com.prepedgeAi.AiModel.Service.IMPL;

import com.prepedgeAi.AiModel.DTO.AuthResponse;
import com.prepedgeAi.AiModel.DTO.LoginRequest;
import com.prepedgeAi.AiModel.DTO.SignUpRequest;
import com.prepedgeAi.AiModel.Entity.User;
import com.prepedgeAi.AiModel.Repository.UserRepository;
import com.prepedgeAi.AiModel.Security.JwtUtil;
import com.prepedgeAi.AiModel.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceIMPL implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse registerUser(SignUpRequest signUpRequest) {
        // Build and save the new user
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        userRepository.save(user);

        // Generate JWT for the new user
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    @Override
    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        // Delegate credential verification to Spring Security
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Auth succeeded — look up the user to get the name
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    @Override
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
