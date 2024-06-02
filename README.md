# Microservices Architecture

A modular Node.js application designed to demonstrate the integration and operation of several independent services within a single repository. This setup is ideal for demonstrating a microservices architecture, where each service is developed and run independently but works together as parts of a whole system.

## Description

This project includes three main components:

- **Service One**: Service
- **Service Two**: Service (Also has case of circuit breaker : The Circuit Breaker pattern prevents a network or service failure from cascading to other parts of the system)
- **Service Registry**: To find all registered services urls 
- **Auth Service**: To authenticate and authrization 
- **API Gateway**: Acts as the central entry point for client requests, routing them to the appropriate service based on the request path.

Each service is self-contained within its own subdirectory and can be run independently or simultaneously through a unified command.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 14 or higher recommended)
- npm (normally comes with Node.js)

### Installation

First, clone the repository to your local machine:

```bash
git clone [repository URL]
cd [repository directory]
```
Then, install dependencies for each service:
```bash
cd service-one
npm install
cd ../service-two
npm install
cd ../api-gateway
npm install
cd ..
```

Running the Services
To start all services simultaneously:

```bash
npm run start:all
```




