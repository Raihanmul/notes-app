import express from "express";
import { testConnection } from "./config/db.js";
import helloRouter from "./routes/helloRoute.js";
import noteRouter from "./routes/notesRoute.js";

const app = express();

app.use(express.json());

app.use(helloRouter);
app.use(noteRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  testConnection();
});
