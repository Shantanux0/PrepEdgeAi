package com.prepedgeAi.AiModel.Controller;


import com.prepedgeAi.AiModel.DTO.AuthResponse;
import com.prepedgeAi.AiModel.DTO.LoginRequest;
import com.prepedgeAi.AiModel.DTO.SignUpRequest;
import com.prepedgeAi.AiModel.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        if (authService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        AuthResponse authResponse = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
