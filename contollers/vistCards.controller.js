const VistCardsService = require("../services/vistCards.service");
class VistCardsController {
  static async index(req, res) {
    try {
      res.send(await VistCardsService.index(req.user._id));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async create(req, res) {
    try {
      res.send(await VistCardsService.create(req.body, req.user.id));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async show(req, res) {
    try {
      res.send(await VistCardsService.show(req.params.id, req.user.id));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async update(req, res) {
    try {
      res.send(
        await VistCardsService.update(req.params.id, req.user.id, req.body)
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async delete(req, res) {
    try {
      res.send(await VistCardsService.delete(req.params.id, req.user.id));
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}

module.exports = VistCardsController;
