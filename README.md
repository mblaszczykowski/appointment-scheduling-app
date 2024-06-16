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
- NativeWind

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
npm install -g expo-cli
```

```
cd mobile
npm install
npm start
```
