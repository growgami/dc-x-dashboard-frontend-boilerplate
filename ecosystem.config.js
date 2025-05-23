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
      args: "dist/scheduler/features/x-metrics/services/xMetricsScheduler.cjs",
      cwd: "./",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};