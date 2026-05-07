package com.prepedgeAi.AiModel.Service.IMPL;

import com.prepedgeAi.AiModel.Entity.User;
import com.prepedgeAi.AiModel.Repository.UserRepository;
import com.prepedgeAi.AiModel.Security.CustomUserDetails;
import com.prepedgeAi.AiModel.Service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        return new CustomUserDetails(user);
    }
}
