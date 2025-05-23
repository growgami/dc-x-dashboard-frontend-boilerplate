"use strict";
/**
 * Aggregates tweet_metrics into daily engagement_metrics.
 * For each day, sums:
 *   - impressions (views)
 *   - engagements (likes + retweets + replies + quotes + bookmarks)
 *   - followers (latest value per day)
 * and inserts/updates one row per day in engagement_metrics.
 *
 * Returns a summary of the aggregation.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateEngagementMetrics = aggregateEngagementMetrics;
var index_1 = require("../../../../lib/db/index");
function aggregateEngagementMetrics() {
    return __awaiter(this, void 0, void 0, function () {
        var db, dates, upserts, _i, dates_1, post_date, metrics, impressions, engagements, followers, _a, metrics_1, m;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, index_1.getDb)()];
                case 1:
                    db = _b.sent();
                    return [4 /*yield*/, db.query("\n    SELECT DISTINCT post_date FROM tweets ORDER BY post_date ASC\n  ")];
                case 2:
                    dates = (_b.sent()).rows;
                    upserts = [];
                    _i = 0, dates_1 = dates;
                    _b.label = 3;
                case 3:
                    if (!(_i < dates_1.length)) return [3 /*break*/, 7];
                    post_date = dates_1[_i].post_date;
                    return [4 /*yield*/, db.query("\n      SELECT likes, retweets, replies, views, quotes, bookmarks, followers\n      FROM tweet_metrics\n      JOIN tweets ON tweet_metrics.tweet_id = tweets.tweet_id\n      WHERE tweets.post_date = $1\n      ", [post_date])];
                case 4:
                    metrics = (_b.sent()).rows;
                    if (metrics.length === 0)
                        return [3 /*break*/, 6];
                    impressions = 0;
                    engagements = 0;
                    followers = 0;
                    for (_a = 0, metrics_1 = metrics; _a < metrics_1.length; _a++) {
                        m = metrics_1[_a];
                        impressions += m.views;
                        engagements += m.likes + m.retweets + m.replies + m.quotes + m.bookmarks;
                        if (m.followers > followers)
                            followers = m.followers; // Use max followers for the day
                    }
                    // Upsert into engagement_metrics
                    return [4 /*yield*/, db.query("\n      INSERT INTO engagement_metrics (date, impressions, engagements, followers)\n      VALUES ($1, $2, $3, $4)\n      ON CONFLICT (date) DO UPDATE\n        SET impressions = EXCLUDED.impressions,\n            engagements = EXCLUDED.engagements,\n            followers = EXCLUDED.followers\n      ", [post_date, impressions, engagements, followers])];
                case 5:
                    // Upsert into engagement_metrics
                    _b.sent();
                    upserts.push({
                        date: post_date,
                        impressions: impressions,
                        engagements: engagements,
                        followers: followers,
                    });
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [2 /*return*/, {
                        daysProcessed: upserts.length,
                        upserts: upserts,
                    }];
            }
        });
    });
}
