# React Frontend

### Uruchomienie

```
cd frontend
npm install
npm start
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
