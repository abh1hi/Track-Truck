module.exports = {
  apps: [
    {
      name: "track-truck-api",
      script: "server.js",
      env: { NODE_ENV: "production" },
      watch: false,
      instances: 1
    }
  ]
};
