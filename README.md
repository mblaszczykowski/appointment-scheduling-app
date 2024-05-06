# React Frontend

### Uruchomienie

```
yarn install
```
```
yarn start
```

Zauważyłem, że aplikacja musi działać na porcie 3000 (domyślnym) aby łączyła się poprawnie z backendem, nie patrzyłem jeszcze dlaczego, czy to gdzieś jest zdefiniowane.

### Resources

- Używamy Tailwind CSS

- Komponenty, style, klasy bierzemy z <b>preline.co</b> oraz <b>flowbite.com</b> bądź innych, jednak chodzi o w miarę spójny styl

- Pod względem kodu wzorujemy się na Vidly z kursu Mastering React Mosha

- Pod względem funkcjonalności można się wzorować na:
https://github.com/hatchways/team-carbonara
bądź samym Calendly.com

# Java Backend

### Create a database

```
psql -U postgres
CREATE DATABASE calendly;
GRANT ALL PRIVILEGES ON DATABASE "calendly" TO postgres;
```

### Authentication

The authentication is handled with a JWT.

The application is stateless. This means that no session is managed by Spring, no data is stored in the session.

Each request to protected resources must contain a JWT in the Authorization header to be accepted.

Only two requests don't need the JWT, the login and the register. But both will generate a JWT after their action finishes correctly.

More:

The `JwtAuthFitler` is necessary to read the JWT from the HTTP headers.

The `PasswordConfig` is to encode and decode the passwords, to avoid having the passwords in plain text.

The `SecurityConfig` contains the Spring Security 6 configuration, with the protected routes, exception handler and the http filters.

The `UserAuthenticationEntryPoint` manages the exceptions.

The `UserAuthenticationProvider` manages the authentication, creating the JWT or validating it.

The `UsernamePasswordAuthFitler` is the filter which reads the username and password information.

The `WebConfig` contains the CORS configuration.

