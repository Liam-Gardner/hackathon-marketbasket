import * as fs from "fs";
import path from "path";
import { Data, Rule, WebOrderPayload } from "../types";

const dataPath = path.resolve("./", "data");

export const getRuleSet = ({
  menuItemIds,
  ruleSetNumber,
  whiteLabel,
}: {
  menuItemIds: WebOrderPayload["MenuItemIdsInBasket"];
  ruleSetNumber: number;
  whiteLabel: string;
}): string[] => {
  const rules = convertRulesToJson(ruleSetNumber, whiteLabel);
  const recommendedItems = getRecommendedItems(menuItemIds, rules);
  return recommendedItems;
};

const getRecommendedItems = (menuItemIds: string, rules: Rule[]): string[] => {
  const ids = Array.of(menuItemIds);
  const recommendedItems: string[] = [];
  for (let i = 0; i <rules.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (rules[i].lhs == ids[j]) {
        recommendedItems.push(rules[i].lhs);
      }
    }
  }
  return recommendedItems;
};

export const convertRulesToJson = (
  ruleSetNumber: number = 1,
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