# Stage 1: Build the service
FROM maven:3.9.9-eclipse-temurin-21 AS builder

# Create app working directory
WORKDIR /app

# Copy parent pom.xml
COPY ../pom.xml ../pom.xml

# Copy the service-specific pom and source code
COPY pom.xml .
COPY src ./src

# Build the project
RUN mvn clean package -DskipTests

# Stage 2: Run the built JAR
FROM openjdk:21-jdk AS runner

WORKDIR /app

# Copy the JAR file from the builder image
COPY --from=builder /app/target/api-gateway-0.0.1-SNAPSHOT.jar ./app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]
