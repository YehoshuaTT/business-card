const express = require("express");

const BuissnessCardsController = require("../contollers/businessCards.controller");
const { validateToken } = require("../middleware/auth");

const businessCardsRoutes = express.Router();
businessCardsRoutes.get("/", BuissnessCardsController.index);

businessCardsRoutes.use(validateToken);
businessCardsRoutes.post("/upload", BuissnessCardsController.upload);
businessCardsRoutes.get("/:id", BuissnessCardsController.show);
businessCardsRoutes.post("/", BuissnessCardsController.create);
businessCardsRoutes.put("/:id", BuissnessCardsController.update);
businessCardsRoutes.delete("/:id", BuissnessCardsController.delete);

module.exports = businessCardsRoutes;
