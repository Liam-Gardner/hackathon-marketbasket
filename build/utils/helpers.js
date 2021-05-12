"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertRulesToJson = exports.getRuleSet = void 0;
var fs = __importStar(require("fs"));
var path_1 = __importDefault(require("path"));
var dataPath = path_1.default.resolve("./", "data");
exports.getRuleSet = function (_a) {
    var menuItemIds = _a.menuItemIds, ruleSetNumber = _a.ruleSetNumber, whiteLabel = _a.whiteLabel;
    var rules = exports.convertRulesToJson(ruleSetNumber, whiteLabel);
    var recommendedItems = getRecommendedItems(menuItemIds, rules);
    return recommendedItems;
};
var getRecommendedItems = function (menuItemIds, rules) {
    var ids = Array.of(menuItemIds);
    var recommendedItems = [];
    for (var i = 0; i < rules.length; i++) {
        for (var j = 0; j < ids.length; j++) {
            if (rules[i].lhs == ids[j]) {
                recommendedItems.push(rules[i].lhs);
            }
        }
    }
    return recommendedItems;
};
exports.convertRulesToJson = function (ruleSetNumber, whitelabel) {
    if (ruleSetNumber === void 0) { ruleSetNumber = 1; }
    var jsonRules = fs.readFileSync(dataPath + "/" + whitelabel + "-" + ruleSetNumber + ".json", { encoding: "utf8" });
    var parsedJson = JSON.parse(jsonRules);
    var support = parsedJson.support, confidence = parsedJson.confidence, lift = parsedJson.lift, count = parsedJson.count;
    var lhs = parsedJson.lhs.map(function (str) {
        return str.replace(/[{}]/gm, "");
    });
    var rhs = parsedJson.rhs.map(function (str) {
        return str.replace(/[{}]/gm, "");
    });
    var rule = {};
    var rules = [];
    var _loop_1 = function (i) {
        rule = {
            lhs: lhs[i],
            rhs: rhs[i],
            lift: lift[i],
            confidence: confidence[i],
            count: count[i],
            support: support[i],
        };
        var isDuplicate = rules.some(function (obj) { return obj.lhs === lhs[i]; });
        if (!isDuplicate) {
            rules.push(rule);
        }
    };
    for (var i = 0; i < parsedJson.lhs.length; i++) {
        _loop_1(i);
    }
    return rules;
};
