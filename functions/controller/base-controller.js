
/* eslint-disable no-console */

const { StatusCodes } = require("http-status-codes");

class Controller {
  static routes() {
    return {
      teste: "/teste",
    };
  }

  static teste() {
    return async (req, res) => {
      try {
        res
          .status(StatusCodes.OK)
          .send("teste deu certo");
      } catch (error) {
        res
          .status(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ error: error.message });
      }
    };
  }
}
module.exports = Controller;
