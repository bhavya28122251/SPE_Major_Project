# Use a lightweight JDK image to run the JAR
FROM eclipse-temurin:21-jdk-alpine AS runner

WORKDIR /app

# Copy the pre-built JAR from the Jenkins workspace into the image
COPY target/patient-service-0.0.1-SNAPSHOT.jar ./app.jar

# Expose port your app listens on
EXPOSE 8082

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
