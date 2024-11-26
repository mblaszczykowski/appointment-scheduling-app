FROM openjdk:21-jdk-slim
ENV SPRING_PROFILES_ACTIVE=prod
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EXPOSE 8080
