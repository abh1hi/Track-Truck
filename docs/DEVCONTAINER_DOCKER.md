# Devcontainer (DinD/DoOD) quick start

1) Rebuild container
- In VS Code / Codespaces, run: Dev Containers: Rebuild Container

2) Verify Docker is available
```bash
docker --version
docker compose version
```

3) Start services
```bash
docker compose up -d --build
```

4) Check API health
```bash
curl http://localhost:5000/api/health
```
