"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.extractTweetId = extractTweetId;
exports.upsertTweetAndMetrics = upsertTweetAndMetrics;
exports.getMetricsByTimeRange = getMetricsByTimeRange;
exports.getDailyMetrics = getDailyMetrics;
var index_1 = require("../../../../lib/db/index");
/**
 * Extracts the tweet ID from a Twitter status URL.
 */
function extractTweetId(url) {
    var matches = url.match(/\/status\/(\d+)/);
    return matches ? matches[1] : '';
}
/**
 * Inserts or updates a tweet and its metrics in the database.
 */
function upsertTweetAndMetrics(url, postData) {
    return __awaiter(this, void 0, void 0, function () {
        var db, tweetId, rows, existingTweet, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, index_1.getDb)()];
                case 1:
                    db = _a.sent();
                    tweetId = extractTweetId(url);
                    if (!tweetId) {
                        return [2 /*return*/, { success: false, message: 'Could not extract tweet ID from URL' }];
                    }
                    return [4 /*yield*/, db.query('BEGIN')];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 9, , 11]);
                    return [4 /*yield*/, db.query('SELECT tweet_id FROM tweets WHERE tweet_id = $1', [tweetId])];
                case 4:
                    rows = (_a.sent()).rows;
                    existingTweet = rows[0];
                    if (!!existingTweet) return [3 /*break*/, 6];
                    // Insert new tweet
                    return [4 /*yield*/, db.query('INSERT INTO tweets (tweet_id, url, text, post_date) VALUES ($1, $2, $3, $4)', [tweetId, url, postData.text, postData.postDate])];
                case 5:
                    // Insert new tweet
                    _a.sent();
                    _a.label = 6;
                case 6: 
                // Insert metrics
                return [4 /*yield*/, db.query('INSERT INTO tweet_metrics (tweet_id, likes, retweets, replies, views, quotes, bookmarks, followers, collected_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
                        tweetId,
                        postData.likes,
                        postData.retweets,
                        postData.replies,
                        postData.views,
                        postData.quotes,
                        postData.bookmarks,
                        postData.followers,
                        new Date().toISOString(),
                    ])];
                case 7:
                    // Insert metrics
                    _a.sent();
                    return [4 /*yield*/, db.query('COMMIT')];
                case 8:
                    _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: existingTweet ? 'Tweet metrics updated' : 'New tweet metrics stored',
                            updated: true,
                        }];
                case 9:
                    error_1 = _a.sent();
                    return [4 /*yield*/, db.query('ROLLBACK')];
                case 10:
                    _a.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: error_1 instanceof Error ? error_1.message : 'Failed to store X post data',
                        }];
                case 11: return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetches engagement metrics for a given time range.
 */
function getMetricsByTimeRange() {
    return __awaiter(this, arguments, void 0, function (timeRangeParam) {
        var timeRange, db, query, params, days, metrics, _a;
        if (timeRangeParam === void 0) { timeRangeParam = '7d'; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timeRange = timeRangeParam;
                    return [4 /*yield*/, (0, index_1.getDb)()];
                case 1:
                    db = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    query = "\n      SELECT \n        id,\n        tweet_id,\n        date,\n        impressions,\n        engagements,\n        created_at\n      FROM engagement_metrics\n    ";
                    params = [];
                    if (timeRange !== 'all') {
                        days = null;
                        days = parseInt(timeRange, 10);
                        if (!isNaN(days)) {
                            query += ' WHERE date >= date(?, ?)';
                            params.push('now', "-".concat(days, " days"));
                        }
                    }
                    query += ' ORDER BY date ASC';
                    return [4 /*yield*/, db.query(query, params)];
                case 3:
                    metrics = (_b.sent()).rows;
                    return [2 /*return*/, metrics];
                case 4:
                    _a = _b.sent();
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Fetches daily/weekly/monthly aggregated metrics for a time range.
 */
function getDailyMetrics() {
    return __awaiter(this, arguments, void 0, function (timeRangeParam, grouping) {
        var timeRange, db, selectClause, groupByClause, query, params, days, metrics, _a;
        if (timeRangeParam === void 0) { timeRangeParam = '7d'; }
        if (grouping === void 0) { grouping = 'day'; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timeRange = timeRangeParam;
                    return [4 /*yield*/, (0, index_1.getDb)()];
                case 1:
                    db = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    selectClause = '';
                    groupByClause = '';
                    if (grouping === 'week') {
                        selectClause = "\n        EXTRACT(YEAR FROM CAST(date AS date)) AS year,\n        TO_CHAR(CAST(date AS date), 'IW') AS week,\n        MIN(CAST(date AS date)) AS start_date,\n        MAX(CAST(date AS date)) AS end_date,\n        SUM(impressions) AS impressions,\n        SUM(engagements) AS engagements,\n        SUM(followers) AS followers\n      ";
                        groupByClause = 'GROUP BY year, week ORDER BY year ASC, week ASC';
                    }
                    else if (grouping === 'month') {
                        selectClause = "\n        EXTRACT(YEAR FROM CAST(date AS date)) AS year,\n        TO_CHAR(CAST(date AS date), 'MM') AS month,\n        MIN(CAST(date AS date)) AS start_date,\n        MAX(CAST(date AS date)) AS end_date,\n        SUM(impressions) AS impressions,\n        SUM(engagements) AS engagements,\n        SUM(followers) AS followers\n      ";
                        groupByClause = 'GROUP BY year, month ORDER BY year ASC, month ASC';
                    }
                    else {
                        selectClause = "\n        CAST(date AS date) as date,\n        SUM(impressions) as impressions,\n        SUM(engagements) as engagements,\n        SUM(followers) as followers\n      ";
                        groupByClause = 'GROUP BY date ORDER BY date ASC';
                    }
                    query = "\n      SELECT\n        ".concat(selectClause, "\n      FROM engagement_metrics\n    ");
                    params = [];
                    if (timeRange !== 'all') {
                        days = null;
                        if (/^\d+d$/.test(timeRange)) {
                            days = parseInt(timeRange, 10);
                        }
                        if (days !== null && !isNaN(days)) {
                            query += " WHERE date IN (\n          SELECT date FROM engagement_metrics\n          GROUP BY date\n          ORDER BY date DESC\n          LIMIT ".concat(days, "\n        )");
                        }
                    }
                    query += " ".concat(groupByClause);
                    return [4 /*yield*/, db.query(query, params)];
                case 3:
                    metrics = (_b.sent()).rows;
                    return [2 /*return*/, metrics.map(function (row) { return (__assign(__assign({}, row), { label: grouping === 'day'
                                ? row.date
                                : (grouping === 'week'
                                    ? "".concat(row.year, "-W").concat(row.week, " (").concat(row.start_date, " to ").concat(row.end_date, ")")
                                    : "".concat(row.year, "-").concat(row.month, " (").concat(row.start_date, " to ").concat(row.end_date, ")")) })); })];
                case 4:
                    _a = _b.sent();
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
