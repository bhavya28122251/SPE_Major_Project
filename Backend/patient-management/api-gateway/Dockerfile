# Stage 1: Build the service
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Step 1: Copy parent POM
COPY ../../pom.xml /tmp/patient-management-parent.xml  # Adjust path to your repo layout

# Step 2: Install parent POM into Maven local repository
RUN mvn install:install-file \
    -Dfile=/tmp/patient-management-parent.xml \
    -DgroupId=com.healthcare \
    -DartifactId=patient-management-system \
    -Dversion=1.0-SNAPSHOT \
    -Dpackaging=pom

# Step 3: Copy microservice's pom and source
COPY pom.xml .
COPY src ./src

# Step 4: Build microservice
RUN mvn clean package -DskipTests

# Stage 2: Run the service
FROM openjdk:21-jdk AS runner

WORKDIR /app

COPY --from=builder /app/target/api-gateway-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]
