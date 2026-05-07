package com.prepedgeAi.AiModel.Service;

import com.prepedgeAi.AiModel.DTO.AuthResponse;
import com.prepedgeAi.AiModel.DTO.LoginRequest;
import com.prepedgeAi.AiModel.DTO.SignUpRequest;

public interface AuthService {
    AuthResponse registerUser(SignUpRequest signUpRequest);
    AuthResponse authenticateUser(LoginRequest loginRequest);
    Boolean existsByEmail(String email);
}
