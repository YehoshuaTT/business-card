const BusinessCardsService = require("../services/businessCards.service");

class BusinessCardsController {
  static async index(req, res) {
    try {
      res.send(await BusinessCardsService.index());
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async create(req, res) {
    try {
      res.send(await BusinessCardsService.create(req.body, req.user.id));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async show(req, res) {
    try {
      res.send(await BusinessCardsService.show(req.params.id, req.user.id));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async update(req, res) {
    try {
      res.send(
        await BusinessCardsService.update(req.params.id, req.user.id, req.body)
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async delete(req, res) {
    try {
      res.send(await BusinessCardsService.delete(req.params.id, req.user.id));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}

module.exports = BusinessCardsController;
