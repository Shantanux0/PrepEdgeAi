package com.prepedgeAi.AiModel.Service;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface CustomUserDetailsService extends UserDetailsService {
    // Inherits loadUserByUsername(String username) from Spring Security's UserDetailsService
}
