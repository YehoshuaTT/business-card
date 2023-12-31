const BusinessCardsService = require("../services/businessCards.service");

const { z } = require("zod");

const CardSchema = z.object({
  businessType: z.string().optional(),
  webURL: z.string().url().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
});
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
      const zodCheck = CardSchema.safeParse(req.body);
      if (zodCheck.success) {
        res.send(await BusinessCardsService.create(req.body, req.user));
      } else {
        console.log(zodCheck.error);
        throw new Error();
      }
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
      const zodCheck = CardSchema.safeParse(req.body);
      if (zodCheck.success) {
        res.send(
          await BusinessCardsService.update(
            req.params.id,
            req.user.id,
            req.body
          )
        );
      } else throw new Error();
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

  static async upload(req, res) {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const image = await BusinessCardsService.upload(req.files?.image);
      if (
        await BusinessCardsService.update(req.params.id, req.user.id, { image })
      )
        res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
}

module.exports = BusinessCardsController;
