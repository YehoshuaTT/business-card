const express = require("express");

const VistCardsController = require("../contollers/vistCards.controller");
const { validateToken } = require("../middleware/auth");

const visitCardsRoutes = express.Router();
visitCardsRoutes.use(validateToken);

visitCardsRoutes.get("/", VistCardsController.index);
visitCardsRoutes.get("/:id", VistCardsController.show);
visitCardsRoutes.post("/", VistCardsController.create);
visitCardsRoutes.put("/:id", VistCardsController.update);
visitCardsRoutes.delete("/:id", VistCardsController.delete);

module.exports = visitCardsRoutes;
