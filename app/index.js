const express = require("express");
const prom = require('prom-client');

const app = express();

const register = prom.register;

const counter = new prom.Counter({
  name: "counter_request_total",
  help: "Request counter",
  labelNames: ["statusCode"]
});

const gauge = new prom.Gauge({
  name: "gauge_free_bytes",
  help: "Gauge example"
});

const histogram = new prom.Histogram({
  name: "histogram_request_time_seconds",
  help: "API Time",
  buckets: [0.1, 0.2, 0.3, 0.4, 0.5] // milliseconds
})

const summary = new prom.Summary({
  name: "summary_request_time_seconds",
  help: "API Time with summary",
  percentiles: [0.5, 0.9, 0.99]
})

const activeUsers = new prom.Gauge({
  name: "class_total_active_users",
  help: "Online users"
});

let users = true

setInterval(() => {
  const status = ["200", "300", "400", "404"][Math.floor(Math.random() * 4)];

  activeUsers.set(users ? Math.floor(100 * Math.random()) : 0);
  setTimeout(() => {
    counter.labels(status).inc();
    const millisecondsSimulation = Math.random();
    histogram.observe(millisecondsSimulation);
    summary.observe(millisecondsSimulation);
  }, 1000 * (5 * Math.random()));

}, 1000)


app.get("/", (req, res) => {
  // counter.inc()
  counter.labels('200').inc();
  counter.labels('300').inc();

  gauge.set(100 * Math.random());

  const millisecondsSimulation = Math.random()
  histogram.observe(millisecondsSimulation)
  summary.observe(millisecondsSimulation)

  return res.send("Hello World")
});

app.get("/failed", (req, res) => {
  counter.labels('400').inc();
  return res.send("Hello World")
});


app.post("/webhook", (req, res) => {
  console.log("Received", req.body);
  return res.status(200).json({});
})

app.get("/non-users", (req, res) => {
  users = false;
  return res.send("Stopped")
})

app.get("/users", (req, res) => {
  users = true;
  return res.send("Normalized")
})

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics())
})

app.listen(3000, () => console.log("Running on 3000"))
