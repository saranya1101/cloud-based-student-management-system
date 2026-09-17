import { ProjectFile } from '../types';

export const PROJECT_SOURCE_FILES: ProjectFile[] = [
  {
    path: 'backend/src/main/java/com/cloudsms/controller/StudentController.java',
    filename: 'StudentController.java',
    language: 'java',
    category: 'Spring Boot',
    description: 'REST Controller handling CRUD operations with Spring Security RBAC annotations',
    content: `package com.cloudsms.controller;

import com.cloudsms.dto.StudentRequest;
import com.cloudsms.dto.StudentResponse;
import com.cloudsms.model.Student;
import com.cloudsms.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RESTful Controller for Student Management CRUD operations.
 * Implements Role-Based Access Control (RBAC) via @PreAuthorize annotations.
 */
@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<Page<StudentResponse>> getAllStudents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double minGpa,
            Pageable pageable) {
        return ResponseEntity.ok(studentService.findAll(department, status, minGpa, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable String id) {
        return ResponseEntity.ok(studentService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest request) {
        StudentResponse created = studentService.create(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable String id,
            @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable String id) {
        studentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/grades")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<StudentResponse> recordGrades(
            @PathVariable String id,
            @RequestParam String courseCode,
            @RequestParam Double score,
            @RequestParam String grade) {
        return ResponseEntity.ok(studentService.updateCourseGrade(id, courseCode, score, grade));
    }
}`
  },
  {
    path: 'backend/src/main/java/com/cloudsms/service/StudentService.java',
    filename: 'StudentService.java',
    language: 'java',
    category: 'Spring Boot',
    description: 'Service interface defining student business logic and transactional boundaries',
    content: `package com.cloudsms.service;

import com.cloudsms.dto.StudentRequest;
import com.cloudsms.dto.StudentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentService {
    Page<StudentResponse> findAll(String department, String status, Double minGpa, Pageable pageable);
    StudentResponse findById(String id);
    StudentResponse create(StudentRequest request);
    StudentResponse update(String id, StudentRequest request);
    void deleteById(String id);
    StudentResponse updateCourseGrade(String id, String courseCode, Double score, String grade);
}`
  },
  {
    path: 'backend/src/main/java/com/cloudsms/model/Student.java',
    filename: 'Student.java',
    language: 'java',
    category: 'Spring Boot',
    description: 'JPA Entity mapped to MySQL database table with constraints and audit timestamps',
    content: `package com.cloudsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_dept", columnList = "department"),
    @Index(name = "idx_student_status", columnList = "status"),
    @Index(name = "idx_student_email", columnList = "email", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @Column(name = "id", length = 32, nullable = false)
    private String id; // e.g. STU-2024-001

    @NotBlank(message = "First name is mandatory")
    @Column(name = "first_name", nullable = false, length = 64)
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    @Column(name = "last_name", nullable = false, length = 64)
    private String lastName;

    @Email(message = "Email must be valid")
    @NotBlank
    @Column(name = "email", nullable = false, unique = true, length = 128)
    private String email;

    @Column(name = "phone", length = 32)
    private String phone;

    @NotBlank
    @Column(name = "department", nullable = false, length = 64)
    private String department;

    @Min(1) @Max(8)
    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "enrollment_year", nullable = false)
    private Integer enrollmentYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StudentStatus status;

    @DecimalMin("0.0") @DecimalMax("4.0")
    @Column(name = "gpa", nullable = false)
    private Double gpa;

    @Column(name = "address", length = 255)
    private String address;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CourseEnrollment> enrollments = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}`
  },
  {
    path: 'backend/src/main/java/com/cloudsms/repository/StudentRepository.java',
    filename: 'StudentRepository.java',
    language: 'java',
    category: 'Spring Boot',
    description: 'Spring Data JPA repository with customized query methods and pagination support',
    content: `package com.cloudsms.repository;

import com.cloudsms.model.Student;
import com.cloudsms.model.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT s FROM Student s WHERE " +
           "(:department IS NULL OR s.department = :department) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:minGpa IS NULL OR s.gpa >= :minGpa)")
    Page<Student> findFiltered(
            @Param("department") String department,
            @Param("status") StudentStatus status,
            @Param("minGpa") Double minGpa,
            Pageable pageable);
}`
  },
  {
    path: 'backend/src/main/java/com/cloudsms/config/SecurityConfig.java',
    filename: 'SecurityConfig.java',
    language: 'java',
    category: 'Spring Boot',
    description: 'Spring Security 6 configuration with stateless JWT authentication filter and RBAC rules',
    content: `package com.cloudsms.config;

import com.cloudsms.security.JwtAuthenticationEntryPoint;
import com.cloudsms.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health", "/actuator/info", "/actuator/prometheus").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`
  },
  {
    path: 'backend/src/main/resources/application.yml',
    filename: 'application.yml',
    language: 'yaml',
    category: 'Spring Boot',
    description: 'Spring Boot production configuration for AWS RDS MySQL & Actuator Metrics',
    content: `server:
  port: 8080
  shutdown: graceful

spring:
  application:
    name: cloud-student-management-system
  datasource:
    url: jdbc:mysql://\${MYSQL_HOST:localhost}:3306/\${MYSQL_DATABASE:sms_db}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: \${MYSQL_USER:sms_user}
    password: \${MYSQL_PASSWORD:sms_secret_password}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 30000
      max-lifetime: 2000000
      connection-timeout: 30000

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

app:
  jwt:
    secret: \${JWT_SECRET:9a4f2c8d3e7b1a5f6e8d0c2b4a6f8e0d2c4b6a8f0e2d4c6b8a0f2e4d6c8b0a}
    expiration-ms: 86400000 # 24 hours

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
      probes:
        enabled: true`
  },
  {
    path: 'backend/pom.xml',
    filename: 'pom.xml',
    language: 'xml',
    category: 'Spring Boot',
    description: 'Maven Project Object Model with Spring Boot 3.3.x, MySQL, Spring Security, JWT, Lombok',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.2</version>
        <relativePath/>
    </parent>
    <groupId>com.cloudsms</groupId>
    <artifactId>student-management-system</artifactId>
    <version>1.0.0</version>
    <name>cloud-student-management-system</name>
    <description>Cloud-Based Student Management System with Spring Boot, MySQL, AWS & Kubernetes</description>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.5</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web & REST -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Security & RBAC -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL Connector -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JWT Token Authentication -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Boot Actuator for Kubernetes Health & Prometheus -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'docker/Dockerfile',
    filename: 'Dockerfile',
    language: 'dockerfile',
    category: 'Docker & K8s',
    description: 'Multi-stage Docker build optimizing image layer caching and lightweight Alpine JRE',
    content: `# Stage 1: Build JAR package using Maven & Temurin JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace/app

# Copy dependency definition for caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package
COPY src src
RUN mvn clean package -DskipTests

# Stage 2: Production runtime image
FROM eclipse-temurin:21-jre-alpine
LABEL maintainer="Cloud SMS Engineering <devops@cloudsms.edu>"

# Create non-root system user for security
RUN addgroup -S smsgroup && adduser -S smsuser -G smsgroup
USER smsuser:smsgroup

WORKDIR /app

# Copy the built artifact from builder stage
COPY --from=builder /workspace/app/target/student-management-system-1.0.0.jar app.jar

EXPOSE 8080

# Configure JVM flags for containers & memory limits
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`
  },
  {
    path: 'docker/docker-compose.yml',
    filename: 'docker-compose.yml',
    language: 'yaml',
    category: 'Docker & K8s',
    description: 'Docker Compose orchestration for local development with MySQL 8.0 & Spring Boot',
    content: `version: '3.8'

services:
  mysql-db:
    image: mysql:8.0.36
    container_name: sms-mysql-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword123
      MYSQL_DATABASE: sms_db
      MYSQL_USER: sms_user
      MYSQL_PASSWORD: sms_secret_password
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./backend/src/main/resources/schema.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend-api:
    build:
      context: ./backend
      dockerfile: ../docker/Dockerfile
    container_name: sms-backend-service
    restart: on-failure
    ports:
      - "8080:8080"
    environment:
      MYSQL_HOST: mysql-db
      MYSQL_DATABASE: sms_db
      MYSQL_USER: sms_user
      MYSQL_PASSWORD: sms_secret_password
      JWT_SECRET: 9a4f2c8d3e7b1a5f6e8d0c2b4a6f8e0d2c4b6a8f0e2d4c6b8a0f2e4d6c8b0a
    depends_on:
      mysql-db:
        condition: service_healthy

volumes:
  mysql-data:`
  },
  {
    path: 'k8s/deployment.yaml',
    filename: 'deployment.yaml',
    language: 'yaml',
    category: 'Docker & K8s',
    description: 'Kubernetes Production Deployment with RollingUpdate, Liveness/Readiness probes, and resource limits',
    content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudsms-backend
  namespace: production
  labels:
    app: cloudsms-backend
    tier: api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: cloudsms-backend
  template:
    metadata:
      labels:
        app: cloudsms-backend
    spec:
      containers:
      - name: springboot-app
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/cloudsms-backend:v2.4.1
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
          name: http
        resources:
          requests:
            cpu: "250m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "1024Mi"
        env:
        - name: MYSQL_HOST
          valueFrom:
            configMapKeyRef:
              name: cloudsms-config
              key: MYSQL_HOST
        - name: MYSQL_DATABASE
          valueFrom:
            configMapKeyRef:
              name: cloudsms-config
              key: MYSQL_DATABASE
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: cloudsms-secrets
              key: DB_USERNAME
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: cloudsms-secrets
              key: DB_PASSWORD
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: cloudsms-secrets
              key: JWT_SECRET
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 40
          periodSeconds: 15
          timeoutSeconds: 3
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 2
          successThreshold: 1
          failureThreshold: 2`
  },
  {
    path: 'k8s/service-ingress-hpa.yaml',
    filename: 'service-ingress-hpa.yaml',
    language: 'yaml',
    category: 'Docker & K8s',
    description: 'Kubernetes ClusterIP Service, NGINX Ingress Controller routing, and HorizontalPodAutoscaler (HPA)',
    content: `apiVersion: v1
kind: Service
metadata:
  name: cloudsms-service
  namespace: production
  labels:
    app: cloudsms-backend
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  selector:
    app: cloudsms-backend
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cloudsms-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.cloudsms.edu
    secretName: cloudsms-tls-cert
  rules:
  - host: api.cloudsms.edu
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: cloudsms-service
            port:
              number: 80
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cloudsms-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: cloudsms-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`
  },
  {
    path: 'terraform/main.tf',
    filename: 'main.tf',
    language: 'terraform',
    category: 'Terraform IaC',
    description: 'Terraform AWS Infrastructure: VPC, Public/Private Subnets, Internet Gateway, Security Groups',
    content: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "cloudsms-terraform-state-prod"
    key            = "k8s-cluster/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "Cloud-Student-Management-System"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Definition
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "cloudsms-vpc"
  }
}

# Public Subnets for Kubernetes Ingress & NAT
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "\${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "cloudsms-public-1"
  }
}

# Private Subnets for Worker Nodes and MySQL RDS
resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "\${var.aws_region}a"

  tags = {
    Name = "cloudsms-private-1"
  }
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "\${var.aws_region}b"

  tags = {
    Name = "cloudsms-private-2"
  }
}`
  },
  {
    path: 'terraform/ec2_k8s.tf',
    filename: 'ec2_k8s.tf',
    language: 'terraform',
    category: 'Terraform IaC',
    description: 'Terraform EC2 Compute instances for Kubernetes Control Plane and Worker Nodes with IAM roles',
    content: `# Security Group for Kubernetes EC2 Nodes
resource "aws_security_group" "k8s_nodes" {
  name        = "cloudsms-k8s-sg"
  description = "Security group for Kubernetes EC2 nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP Ingress"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS Ingress"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Kubernetes API server"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance for Kubernetes Control Plane
resource "aws_instance" "k8s_master" {
  ami                  = var.ubuntu_ami_id
  instance_type        = "t3.medium"
  subnet_id            = aws_subnet.public_1.id
  vpc_security_group_ids = [aws_security_group.k8s_nodes.id]
  key_name             = var.key_pair_name

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "cloudsms-k8s-master"
    Role = "control-plane"
  }
}

# EC2 Autoscaling Group for Kubernetes Worker Nodes
resource "aws_launch_template" "k8s_worker" {
  name_prefix   = "cloudsms-worker-"
  image_id      = var.ubuntu_ami_id
  instance_type = "t3.large"
  key_name      = var.key_pair_name

  vpc_security_group_ids = [aws_security_group.k8s_nodes.id]

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "cloudsms-k8s-worker"
      Role = "worker-node"
    }
  }
}`
  },
  {
    path: 'terraform/rds_mysql.tf',
    filename: 'rds_mysql.tf',
    language: 'terraform',
    category: 'Terraform IaC',
    description: 'AWS RDS MySQL 8.0 Multi-AZ database instance with automated daily snapshots & encrypted storage',
    content: `# DB Subnet Group spanning across multiple Availability Zones
resource "aws_db_subnet_group" "rds" {
  name       = "cloudsms-rds-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "cloudsms-rds-subnet-group"
  }
}

# RDS Security Group - allows inbound MySQL from EC2 Kubernetes cluster only
resource "aws_security_group" "rds_sg" {
  name        = "cloudsms-rds-sg"
  description = "Allows MySQL traffic strictly from K8s EC2 nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "MySQL from Kubernetes nodes"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.k8s_nodes.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# AWS RDS MySQL Database Instance
resource "aws_db_instance" "mysql" {
  identifier             = "cloudsms-mysql-prod"
  engine                 = "mysql"
  engine_version         = "8.0.36"
  instance_class         = "db.t3.medium"
  allocated_storage      = 50
  max_allocated_storage  = 200
  storage_type           = "gp3"
  storage_encrypted      = true
  multi_az               = true

  db_name                = "sms_db"
  username               = "sms_admin"
  password               = var.db_password
  port                   = 3306

  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  skip_final_snapshot    = false
  final_snapshot_identifier = "cloudsms-mysql-final-snapshot"
  backup_retention_period = 7
  deletion_protection    = true
}`
  },
  {
    path: '.github/workflows/deploy.yml',
    filename: 'deploy.yml',
    language: 'yaml',
    category: 'CI/CD Pipeline',
    description: 'Complete GitHub Actions CI/CD pipeline: Test -> Build -> Dockerize -> ECR Push -> K8s Deployment',
    content: `name: CI/CD Pipeline - Cloud Student Management System

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: cloudsms-backend
  EKS_CLUSTER_NAME: cloudsms-prod-cluster

jobs:
  test-and-build:
    name: 1. Maven Lint, Test & Package
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Run Unit & Integration Tests
        run: mvn clean test -B

      - name: Package Spring Boot Executable JAR
        run: mvn package -DskipTests -B

      - name: Upload Build Artifact
        uses: actions/upload-artifact@v4
        with:
          name: sms-backend-jar
          path: target/*.jar

  docker-build-and-push:
    name: 2. Docker Containerize & Push to AWS ECR
    needs: test-and-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, Tag, and Push Docker Image
        env:
          ECR_REGISTRY: \${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: \${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f docker/Dockerfile .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

  deploy-to-kubernetes:
    name: 3. Deploy to Kubernetes Cluster on AWS EC2
    needs: docker-build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout Manifests
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Update Kubeconfig
        run: |
          aws eks update-kubeconfig --region \${{ env.AWS_REGION }} --name \${{ env.EKS_CLUSTER_NAME }}

      - name: Apply Kubernetes Manifests & Rolling Restart
        run: |
          kubectl apply -f k8s/configmap.yaml
          kubectl apply -f k8s/deployment.yaml
          kubectl apply -f k8s/service-ingress-hpa.yaml
          kubectl set image deployment/cloudsms-backend springboot-app=\${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.\${{ env.AWS_REGION }}.amazonaws.com/$ECR_REPOSITORY:\${{ github.sha }} -n production
          kubectl rollout status deployment/cloudsms-backend -n production --timeout=180s`
  },
  {
    path: 'backend/src/main/resources/schema.sql',
    filename: 'schema.sql',
    language: 'sql',
    category: 'Database',
    description: 'MySQL Relational Schema DDL: students, courses, enrollments, users, roles with foreign keys & indexes',
    content: `-- Cloud-Based Student Management System
-- MySQL 8.0 DDL Schema Definition

CREATE DATABASE IF NOT EXISTS sms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sms_db;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT IGNORE INTO roles (id, name) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_FACULTY'),
(3, 'ROLE_STUDENT');

-- 2. Users Table for RBAC Authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. User-Role Mapping Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Students Entity Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(32) PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    phone VARCHAR(32),
    department VARCHAR(64) NOT NULL,
    semester INT NOT NULL DEFAULT 1,
    enrollment_year INT NOT NULL,
    status ENUM('Active', 'On Leave', 'Graduated', 'Suspended') NOT NULL DEFAULT 'Active',
    gpa DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dept (department),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 5. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    code VARCHAR(16) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    department VARCHAR(64) NOT NULL
) ENGINE=InnoDB;

-- 6. Student Course Enrollments & Grades
CREATE TABLE IF NOT EXISTS course_enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(32) NOT NULL,
    course_code VARCHAR(16) NOT NULL,
    grade VARCHAR(4),
    score DECIMAL(5, 2),
    attendance_percent DECIMAL(5, 2) DEFAULT 100.00,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_code) REFERENCES courses(code) ON DELETE CASCADE,
    UNIQUE KEY uk_student_course (student_id, course_code)
) ENGINE=InnoDB;`
  },
  {
    path: 'README.md',
    filename: 'README.md',
    language: 'markdown',
    category: 'Spring Boot',
    description: 'Comprehensive project architecture documentation, local setup guide, and cloud deployment manual',
    content: `# Cloud-Based Student Management System
> **Tech Stack:** Spring Boot 3.3 | MySQL 8.0 | AWS EC2 & RDS | Docker | Kubernetes | Terraform | GitHub Actions

A cloud-native, production-grade Student Management System architected for high availability, security, and horizontal scalability.

## 🚀 Key Features
1. **RESTful APIs with Spring Boot 3**: High-performance CRUD endpoints handling pagination, sorting, search, and transactional operations.
2. **Role-Based Access Control (RBAC)**: Fine-grained authorization powered by Spring Security 6 & JWT tokens across \`ROLE_ADMIN\`, \`ROLE_FACULTY\`, and \`ROLE_STUDENT\`.
3. **Containerization & Kubernetes**: Multi-stage Dockerized containers managed with Kubernetes Deployments, Rolling Updates, HPA (Horizontal Pod Autoscaling), and NGINX Ingress on AWS EC2.
4. **Infrastructure as Code (IaC)**: Automated provisioning of AWS VPC, multi-AZ subnets, security groups, EC2 instances, and RDS MySQL with Terraform.
5. **CI/CD Pipeline**: GitHub Actions automation executing unit tests, container builds, Amazon ECR publishing, and zero-downtime rolling deployments.

## 🛠️ Local Development (Quick Start)
\`\`\`bash
# 1. Start MySQL & Spring Boot with Docker Compose
docker-compose up -d

# 2. Test Health Endpoint
curl http://localhost:8080/actuator/health

# 3. Authenticate & Obtain JWT Token
curl -X POST http://localhost:8080/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin.jenkins@cloudsms.edu","password":"AdminPassword123"}'
\`\`\`

## ☁️ Terraform Deployment
\`\`\`bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
\`\`\`
`
  }
];
