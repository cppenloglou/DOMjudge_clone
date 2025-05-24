# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies separately to cache this layer
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src
COPY problems_description ./problems_description

# Build the application
RUN mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN apk add --no-cache curl

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Copy the built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/problems_description ./problems_description

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]