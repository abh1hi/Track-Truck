# Codespaces quick start

1) Create .env from example

```bash
cp .env.example .env
```

2) Start services

```bash
docker compose up -d --build
```

3) Check API health

```bash
curl http://localhost:5000/api/health
```

4) Open dashboard

- http://localhost:3000

Notes
- MongoDB persists in the named volume `mongo_data`
- API connects via internal hostname `mongo`
- For Android emulator, set VITE_BACKEND_URL to http://10.0.2.2:5000 in employee app
