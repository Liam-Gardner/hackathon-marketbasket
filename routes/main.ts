import { Request, Router } from "express";
import { callSageMaker } from "../services/main";
import { WebOrderPayload } from "../types";
import { getRuleSet, serializeRequest } from "../utils/helpers";
const router = Router();

router.post("/getRules", async (req: Request<{}, {}, WebOrderPayload>, res) => {
  console.log("getRules body", req.body)
  try {
    const sageData = serializeRequest(req.body);
    const ruleSetNumber = await callSageMaker({ data: sageData });

    if (ruleSetNumber) {
      const recommendedItems = getRuleSet({
        ruleSetNumber,
        whiteLabel: "romayos",
        menuItemIds: req.body.MenuItemIdsInBasket,
      });

      res.status(200).send(recommendedItems);
    }
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

module.exports = router;
