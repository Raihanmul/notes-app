import express from "express";
import {
  addNoteHandler,
  deleteNoteByIdHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  updateNoteByIdhandler,
} from "../handlers/notesHandler.js";

const noteRouter = express.Router();

noteRouter.get("/notes", getAllNotesHandler);
noteRouter.post("/notes", addNoteHandler);
noteRouter.get("/notes/:id", getNoteByIdHandler);
noteRouter.put("/notes/:id", updateNoteByIdhandler);
noteRouter.delete("/notes/:id", deleteNoteByIdHandler);

export default noteRouter;
