# Niall - You think your voice matters?

https://en.wikipedia.org/wiki/Neil

The project is named after a boy who believes his voice matters.

## Run the project

```shell
docker compose up -d --build
```

## What has this project accomplished?

- Built a monorepo TS backend using Nest and Turborepo adhering to Twelve-Factor principles
- Set up a monitoring system with
  - OpenTelemetry (collector)
  - Prometheus (metrics)
  - Tempo (traces)
  - Loki (logs)
  - Grafana (dashboards)
- Deployed a Redis cluster and examined the Redlock algorithm
