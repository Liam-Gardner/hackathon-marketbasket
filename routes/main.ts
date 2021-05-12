import { Request, Router } from "express";
import { callSageMaker } from "../services/main";
import { WebOrderPayload } from "../types";
import { getRuleSet } from "../utils/helpers";
const router = Router();

router.post("/getRules", async (req: Request<{}, {}, WebOrderPayload>, res) => {
  try {
    const ruleSetNumber = await callSageMaker(req.body);

    const recommendedItems = getRuleSet({
      ruleSetNumber,
      whiteLabel: "BombayPantry",
      menuItemIds: req.body.MenuItemIdsInBasket,
    });

    res.status(200).send(recommendedItems);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

module.exports = router;
