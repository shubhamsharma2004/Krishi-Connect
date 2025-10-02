import express from "express";
import fetch from "node-fetch";
const app = express();
app.get("/proxy/schemes", async (req, res) => {
  const url = `https://api.data.gov.in/resource/90a30a19-e05d-46c5-94ad-81f34caa7814?api-key=579b46...&format=json&page=${req.query.page||1}&pageSize=${req.query.pageSize||9}`;
  const r = await fetch(url);
  const text = await r.text();
  res.setHeader("Content-Type", "application/json");
  res.send(text);
});
app.listen(3000);