# Backend Learning Plan (JS / Node / Fastify)

Goal: understand backend systems well enough to feel confident as a full-stack JS engineer.
Cadence: one session per week, about 3-4 hours. Some topics may take two sessions.

## How we work

- **One growing project.** This service evolves from a notes API into a documents platform: users, file attachments, background processing, an event stream, and analytics. Every concept answers a real problem in the project.
- **Local first.** Everything runs in Docker via one `docker-compose.yml`. AWS services use LocalStack (S3, SQS, SNS) or MinIO (S3). No cloud account is needed.
- **Each topic follows four steps:**
  1. Understand the problem. What breaks without this?
  2. Build a tiny version yourself (e.g. a `Map`-based session store before using a library).
  3. Switch to the real tool and notice what it adds.
  4. Break it on purpose (kill the DB mid-transaction, send duplicate messages, expire a token).
- **Full-stack side.** A small frontend grows alongside, so each backend topic is visible in a browser.
- **Roles.** You write the code. I guide, review, and correct mental models. I only write code if asked.
- **Each week:** reading (~1h), build (~2h), "break it" experiments, and questions answered in your own words.

## Phase 1: Solid core

- [x] **Week 1: Node concurrency + Docker.** Event loop, thread pool, blocking, why in-memory state doesn't scale. Postgres in Docker, SQL by hand.
- [ ] **Week 2: Postgres and SQL.** Replace the Map with tables (Drizzle or Kysely, SQL stays visible). Schema design, types, constraints, foreign keys, indexes, `EXPLAIN`.
- [ ] **Week 3: Migrations.** Up/down scripts, keeping old data, adding a NOT NULL column safely, backfills, expand/contract for zero-downtime, rollback.
- [ ] **Week 4: Transactions and query behavior.** ACID, isolation levels, locking, deadlocks, N+1, connection pooling, cursor pagination vs OFFSET.
- [ ] **Week 5: Auth part 1, passwords.** Register/login, hashing (argon2), salting, sessions vs JWT, refresh tokens, cookie flags, brute-force protection. Frontend: login form, cookies vs localStorage.
- [ ] **Week 6: Auth part 2, OIDC with Keycloak.** OAuth2 vs OIDC, authorization-code flow with PKCE, JWT validation with JWKS, scopes, roles, RBAC. Okta works the same way (config change). Frontend: redirect login, token handling, silent refresh.

## Phase 2: Hardening and I/O

- [ ] **Week 7: Security.** CORS, CSRF, rate limiting, security headers, secrets, SQL injection, SSRF, password reset flows, logging without leaking secrets. Frontend: reproduce a CORS error, then fix it.
- [ ] **Week 8: File upload to S3.** Streaming multipart, presigned URLs, size limits, content-type spoofing, backpressure, multipart upload. Frontend: direct browser upload with progress.
- [ ] **Week 9: Caching and Redis.** Cache-aside, invalidation, TTLs, stampedes, rate-limit storage, idempotency keys.

## Phase 3: Async and messaging

- [ ] **Week 10: Background jobs.** BullMQ or similar. Retries, backoff, dead-letter queues, idempotency, at-least-once delivery.
- [ ] **Week 11: SQS and SNS.** Fan-out, visibility timeout, DLQ, FIFO vs standard, transactional outbox pattern.
- [ ] **Week 12: Kafka.** Topics, partitions, keys, consumer groups, offsets, ordering, replay. Kafka vs SQS.
- [ ] **Week 13: Delivery guarantees.** At-most-once / at-least-once / exactly-once, deduplication, sagas, eventual consistency.

## Phase 4: Production readiness

- [ ] **Week 14: Reliability.** Graceful shutdown, health/readiness probes, timeouts, retries, circuit breakers, backpressure.
- [ ] **Week 15: Observability.** Structured logs, metrics (Prometheus), tracing (OpenTelemetry), alerts, request ids across services.
- [ ] **Week 16: Deployment.** Dockerfile, multi-stage builds, CI/CD, per-environment config, Kubernetes basics, 12-factor.

## Phase 5: Data platform

- [ ] **Week 17: Stream processing (Flink).** Windows, state, event time vs processing time, exactly-once. Flink is JVM-based, so we use Flink SQL against Kafka. In JS, approximate small cases with a Kafka consumer plus state and see where it breaks.
- [ ] **Week 18: Change data capture (Debezium).** Stream Postgres changes into Kafka, avoid dual writes, pair with the outbox pattern.
- [ ] **Week 19: Lakehouse (Parquet and Iceberg).** Columnar formats, table formats, schema evolution, time travel, ACID on files. No native JS Iceberg library; use Trino or DuckDB (`@duckdb/node-api`) from Node.
- [ ] **Week 20: Trino.** Query Iceberg with SQL, call Trino from Node over HTTP. Query engines vs databases, partitioning.

## Phase 6: Architecture topics (pick as needed)

- [ ] API design: versioning, REST vs GraphQL vs gRPC, webhooks, pagination conventions
- [ ] Search: Elasticsearch/OpenSearch vs Postgres full-text
- [ ] Real-time: WebSockets and Server-Sent Events
- [ ] Multi-tenancy and row-level security
- [ ] Scaling: read replicas, sharding, load balancers, CAP theorem
- [ ] Scheduled jobs, feature flags, payments and webhook handling
- [ ] Monolith vs microservices

## Already done (before week 1)

- [x] Raw HTTP server spike
- [x] Fastify + TypeBox + TS setup
- [x] `/health` with response schema
- [x] In-memory Notes CRUD as a Fastify plugin
- [x] Shared `ErrorSchema`, global error handler, not-found handler, `HttpError`
- [x] `x-request-id` response header via `onSend`
- [ ] Left over (optional, 15 min): `onResponse` request-log hook, pino-pretty for readable dev logs
