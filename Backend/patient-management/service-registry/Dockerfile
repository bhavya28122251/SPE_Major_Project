# Use a lightweight JDK image to run the JAR
FROM eclipse-temurin:21-jdk-alpine AS runner

WORKDIR /app

# Copy the pre-built JAR from the Jenkins workspace into the image
COPY target/service-registry-1.0-SNAPSHOT.jar ./app.jar

# Expose port your app listens on
EXPOSE 8761

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
