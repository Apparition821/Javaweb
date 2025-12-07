package com.minireddit.benutzerverwaltung.interceptor;

import com.minireddit.benutzerverwaltung.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String url = request.getRequestURI();
        System.out.println("Request URL: " + url);

        if (url.contains("/api/auth/login") || url.contains("/api/auth/register")) {
            System.out.println("Login/Register operation, allowing...");
            return true;
        }

        String token = request.getHeader("token");

        if (token == null || token.isEmpty()) {
            System.out.println("Token is empty, returning not logged in");
            response.setStatus(401);
            response.getWriter().write("{\"error\": \"NOT_LOGIN\"}");
            return false;
        }

        try {
            if (!jwtUtil.validateToken(token)) {
                throw new Exception("Token invalid");
            }
            
            String username = jwtUtil.getUsernameFromToken(token);
            System.out.println("Token valid, user: " + username);
            
        } catch (Exception e) {
            System.out.println("Token parsing failed: " + e.getMessage());
            response.setStatus(401);
            response.getWriter().write("{\"error\": \"NOT_LOGIN\"}");
            return false;
        }

        System.out.println("Token valid, allowing access");
        return true;
    }
}