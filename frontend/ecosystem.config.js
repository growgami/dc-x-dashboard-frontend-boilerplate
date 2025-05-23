module.exports = {
  apps: [
    {
      name: "rayls",
      script: "npm",
      args: "start",
      cwd: "./",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "x-metrics-scheduler",
      script: "node",
      args: "src/schedulers/x-metrics/scheduler/xMetricsScheduler.js",
      cwd: "../backend",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
