# Vanish - E2EE self-hosted messenger

Vanish is an Open-Source, disposable, self-hosted messenger with End-to-End Encryption. 

> [!CAUTION]
> Please, read this segment carefully

## Is it secure?

This messenger was developed solely for educational purposes to study and practice encryption implementation. While it implements E2EE (End-to-End Encryption) and **DOES NOT** store any data, it should **NOT** be used for:

    Production environments
    Sensitive communications
    Real-world security purposes
    Any situation requiring genuine privacy protection

This project has not undergone security audits and may contain vulnerabilities. It serves as a learning tool and demonstration of encryption concepts only.

If you need secure communication, please use well-established and properly audited messaging applications.

USE AT YOUR OWN RISK.

## Features

- End-to-End Encryption
- Disposable
- Doesn't store any data [0]

[0] Messages are being stored in redis unless being received, or unless the expiration time (see Configuration).
Same for any other data: handshakes, otc.


## Configuration

Currently supporting only a few **ENV** params. Check `.env.example` for reference.

Currently available params:

```dotenv
# One Time Code Expiration in Seconds
VANISH_OTC_EXPIRE=21600

# HandShake exprire in Seconds
VANISH_HS_EXPIRE=21600

# Message delivery expire in Seconds
VANISH_MSG_EXPIRE=21600

# Change only password here, unless you know what are you doing
REDIS_HOST=vanish_redis
REDIS_PORT=6379
REDIS_PASSWORD=verySecurePassword
REDIS_MAX_RETRIES=1
```

## Building

This project has default `Next.js` build config, just use `npm run build` to build (or any other package manager).

## Developing

Same for building, developing process doesn't differ from the most of `Next.js` apps. Just install dependencies and run
development script.

## Deploying

Checkout `Dockerfile` and `docker-compose.yml`

```yaml
services:
  vanish:
    container_name: vanish
    image: ghcr.io/alpaim/vanish:latest
    environment:
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - REDIS_MAX_RETRIES=${REDIS_MAX_RETRIES}
      - NODE_ENV=production
    networks:
      - vanishLocal
      - vanishPublic
    depends_on:
      - redis

  redis:
    image: redis:alpine
    container_name: vanish_redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    networks:
      - vanishLocal

networks:
  vanishLocal:
    name: vanishLocal
  vanishPublic:
    name: vanishPublic
```