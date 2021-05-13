import * as fs from "fs";
import path from "path";
import { Data, Rule, WebOrderPayload } from "../types";

const dataPath = path.resolve(__dirname, "./", "data");

export const getRuleSet = ({
  menuItemIds,
  ruleSetNumber,
  whiteLabel,
}: {
  menuItemIds: WebOrderPayload["MenuItemIdsInBasket"];
  ruleSetNumber: string;
  whiteLabel: string;
}): string[] => {
  const rules = convertRulesToJson(ruleSetNumber, whiteLabel);
  const recommendedItems = getRecommendedItems(menuItemIds, rules);
  return recommendedItems;
};

const getRecommendedItems = (menuItemIds: string, rules: Rule[]): string[] => {
  const itemIds = Array.isArray(menuItemIds)
    ? menuItemIds.join(", ")
    : menuItemIds;
  const recommendedItems: string[] = [];
  for (let i = 0; i < rules.length; i++) {
    if (rules[i].lhs === itemIds) {
      recommendedItems.push(rules[i].rhs);
    }
  }
  return recommendedItems;
};

export const convertRulesToJson = (
  ruleSetNumber: string,
  whitelabel: string
): Rule[] => {
  const jsonRules = fs.readFileSync(
    `${dataPath}/${whitelabel}-${ruleSetNumber}.json`,
    { encoding: "utf8" }
  );
  const parsedJson: Data = JSON.parse(jsonRules);

  const { support, confidence, lift, count } = parsedJson;
  const lhs: string[] = parsedJson.lhs.map((str: string) =>
    str.replace(/[{}]/gm, "")
  );
  const rhs: string[] = parsedJson.rhs.map((str: string) =>
    str.replace(/[{}]/gm, "")
  );

  let rule = {} as Rule;
  let rules = [] as Rule[];
  for (let i = 0; i < parsedJson.lhs.length; i++) {
    rule = {
      lhs: lhs[i],
      rhs: rhs[i],
      lift: lift[i],
      confidence: confidence[i],
      count: count[i],
      support: support[i],
    };
    let isDuplicate: boolean = rules.some((obj) => obj.lhs === lhs[i]);
    if (!isDuplicate) {
      rules.push(rule);
    }
  }

  return rules;
};

export const serializeRequest = (req: WebOrderPayload): string => {
  const deliveryType = req.DeliveryType === "Delivery" ? "1,0" : "0,1";
  console.log("request from weborder", req);
  const data = `${req.ItemCount},${req.TotalAmountNormalized},${req.DayOfWeek},${req.TimeOfDayNormalized},${req.MainItemCount},${req.MediumItemCount},${req.SmallItemCount},${deliveryType}`;

  return data;
};
