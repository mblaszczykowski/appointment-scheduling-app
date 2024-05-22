## Tech stack:

### Backend
- Java
- Spring Boot
- Spring Data JPA
- PostgreSQL database

### Web
- React
- TailwindCSS

### Mobile
- React Native


## How to run?

#### Backend
##### Create a database
```
psql -U postgres
CREATE DATABASE calendly;
GRANT ALL PRIVILEGES ON DATABASE "calendly" TO postgres;
```

#### Web
```
cd frontend
npm install
npm start
```
Make sure frontend runs on default port 3000.

#### Mobile
```
cd mobile
npm install -g expo-cli
npm install
expo start
```
