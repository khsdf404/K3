FROM openjdk:17-jdk-alpine

# ADD ./target/redis-v1-exec.jar /app/
COPY ./target/redis-v1-exec.jar redis-1.0.0.jar
CMD ["java", "-jar", "redis-1.0.0.jar", "--spring.redis.host=redis"]
