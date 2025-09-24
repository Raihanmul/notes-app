import express from "express";
import {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
} from "../handlers/notesHandler.js";

const noteRouter = express.Router();

noteRouter.get("/notes", getAllNotesHandler);
noteRouter.post("/notes", addNoteHandler);
noteRouter.get("/notes/:id", getNoteByIdHandler);

export default noteRouter;
