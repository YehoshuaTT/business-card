import express from "express";
import BusinessCardsController from "../contollers/businessCards.controller.js";
import { validateToken } from "../middleware/auth.js";

const businessCardsRoutes = express.Router();
businessCardsRoutes.get("/", BusinessCardsController.index);

businessCardsRoutes.use(validateToken);
businessCardsRoutes.put("/upload/:id", BusinessCardsController.upload);
businessCardsRoutes.get("/:id", BusinessCardsController.show);
businessCardsRoutes.post("/", BusinessCardsController.create);
businessCardsRoutes.put("/:id", BusinessCardsController.update);
businessCardsRoutes.delete("/:id", BusinessCardsController.delete);

export default businessCardsRoutes;
