# Ratings And Reviews Backend Microservice

Atelier is a backend microservice for an E-Commerce website which was scaled in AWS EC2 using an Nginx Load Balancing Server, 4 host servers and PostgreSQL database. It supports 5K virtual clients with response latency of 65ms (down from 500ms+).

## Details

### Step 1: API Endpoints and Local testing
After creating all the API endpoints and routes, local benchmarks for each endpoint averaged around 800ms. After indexing, query speeds increased from 3 seconds to 50ms (using PgAdmin) and 10ms (using Postman). Local stress test with K6 shows that the breakpoint was at 500RPS.

### Query Results

| Indexing | Time          |
| :---     | :----:        |
| Without  | 3.131 seconds |
| With/PgAdmin     | 0.045 seconds |
| With/Postman     | 0.010 seconds |

### Step 2: Stress Testing with K6
Doing local testing with K6, I found a bottleneck when running different routes simultaneously, this lead me to modify the server logic accordingly, 
changing from static connection to dynamic list/pool.

![client](https://i.ibb.co/R6Xc5Rh/client2.png)

### Results

![pool](https://i.ibb.co/vwGP2Hr/pool.png)

## Step 2: Deployment and Cloud Based Testing
After these improvements, I deployed the service to AWS for cloud performance tests. then, I found that when hitting a large amount of virtual users per second, the queries speed were higher than 200ms and the error rate was at about 4,9%.

### Stress Test
![server](https://i.ibb.co/F3TgYb3/1-server.png)

## Step 3: Scaling

To solve this, I implemented horizontal scaling using a Load Balancer instance with Round Robin algorithm using 5 hosts, servers.

## Results:
![servers](https://i.ibb.co/LQN9XkP/5-server.png)
