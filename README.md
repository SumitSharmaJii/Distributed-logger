
# Distributed Logging and Search System

This system leverages Docker containers orchestrated with Docker Compose.Key components include Apache Kafka for event streaming, MySQL for persistent storage, and separate services for log ingestion, processing, and search.


## Instructions
- To start services run : 
```bash
  docker-compose up
```
-  Messages can be injested to HTTP server at **localhost:3000**
- **localhost:4000** serves a HTML page to make search queries
    
## Overview

- Containerization:
Docker is utilized for containerization.
Docker Compose orchestrates multiple services.

- Event Streaming with Kafka:

Apache Kafka enables asynchronous communication.
The producer publishes log data to the 'logs' topic.
The consumer subscribes, processes, and stores logs in MySQL.

- Persistent Storage with MySQL:
MySQL is the storage solution for log entries.
Initialization script (init.sql) configures the database schema.

- Producer Service:
Exposes an API endpoint for log ingestion.
Connects to Kafka and publishes data to the 'logs' topic.

- Consumer Service:
Subscribes to the 'logs' topic in Kafka.
Processes incoming messages and inserts them into MySQL.

- Search Service:
Provides a API endpoint for log queries.
Interacts with MySQL for data retrieval.


