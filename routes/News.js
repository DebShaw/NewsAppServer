import express from "express";
import {
  saveNews,
  visitNews,
  deleteNews,
  removeNews,
  fetchNews,
  fetchRecentVisits,
  saveKeyword,
  fetchKeywords,
} from "../controllers/News.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.patch("/save/:id", auth, saveNews);
router.patch("/visit/:id", auth, visitNews);
router.patch("/delete/:id", auth, deleteNews);
router.patch("/remove/:id", auth, removeNews);
router.get("/fetch/:id", auth, fetchNews);
router.get("/fetchvisits/:id", auth, fetchRecentVisits);
router.patch("/keyword/:id", auth, saveKeyword);
router.get("/fetchkeyword/:id", auth, fetchKeywords);

export default router;
