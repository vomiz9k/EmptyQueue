package com.emptyqueue.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

@Configuration
@EnableWebSecurity
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*", allowCredentials = "true")
@Profile("!http")
public class SecSecurityConfig extends WebSecurityConfigurerAdapter {

    public SecSecurityConfig() {
        super();
    }

    @Override
    protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
        // @formatter:off
        auth.inMemoryAuthentication()
        .withUser("user1").password("{noop}user1Pass").roles("USER")
        .and()
        .withUser("user2").password("{noop}user2Pass").roles("USER");
        // @formatter:on
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        // @formatter:off
        http
        .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()).and()
        .authorizeRequests()
        .antMatchers(HttpMethod.GET).permitAll()
        .antMatchers(HttpMethod.PUT).authenticated()
        .antMatchers(HttpMethod.POST).authenticated()
        .antMatchers(HttpMethod.DELETE).authenticated()
        .and()
        .formLogin()
        .loginPage("http://localhost:3000/perform_login")
        .loginProcessingUrl("/perform_login")
        .defaultSuccessUrl("http://localhost:3000/queue",true)
        .failureUrl("http://localhost:3000/perform_login?error=true")
        .and()
        .logout()
        .logoutUrl("/perform_logout")
        .logoutSuccessUrl("http://localhost:3000/")
        .invalidateHttpSession(true)    
        .deleteCookies("JSESSIONID");

        http.cors().and().csrf().disable();
        // @formatter:on
    }


}
