## React Frontend

### Uruchomienie

```
cd frontend
npm install
npm start
```

Front musi działać na porcie 3000 (domyślnym) aby łączył się z backendem.

### Resources

- Używamy Tailwind CSS

- Komponenty, style, klasy bierzemy z <b>preline.co</b> oraz <b>flowbite.com</b>

- Pod względem funkcjonalności można się wzorować na:
https://github.com/hatchways/team-carbonara
bądź samym Calendly.com

## Java Backend

### Create a database

```
psql -U postgres
CREATE DATABASE calendly;
GRANT ALL PRIVILEGES ON DATABASE "calendly" TO postgres;
```

Ustawiłem baze danych w application.properties - spring.jpa.hibernate.ddl-auto na create-drop jako ze ciagle sie zmienialy pola poczatkowo, jak chcecie miec zapisany stan to zmiencie na update.


## React Native
```
cd mobile
npm install -g expo-cli
npm install
expo start
```
