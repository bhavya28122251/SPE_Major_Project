FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Step 1: Copy parent pom.xml (adjust path according to your folder structure)
COPY ../pom.xml /tmp/patient-management-parent.xml

# Step 2: Install parent POM into local Maven repo
RUN mvn install:install-file \
    -Dfile=/tmp/patient-management-parent.xml \
    -DgroupId=com.healthcare \
    -DartifactId=patient-management-system \
    -Dversion=1.0-SNAPSHOT \
    -Dpackaging=pom

# Step 3: Copy this service's pom.xml
COPY pom.xml .

# Step 4: Download dependencies
RUN mvn dependency:go-offline -B

# Step 5: Copy source code
COPY src ./src

# Step 6: Build the project
RUN mvn clean package

FROM openjdk:21-jdk AS runner

WORKDIR /app

COPY --from=builder /app/target/appointment-service-0.0.1-SNAPSHOT.jar ./app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar","app.jar"]
