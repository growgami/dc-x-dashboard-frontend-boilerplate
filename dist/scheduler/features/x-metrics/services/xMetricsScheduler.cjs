"use strict";
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
// Scheduler startup log
console.log("[xMetricsScheduler] Scheduler process started and waiting for scheduled jobs.");
// Log the current time every hour for monitoring, and show time remaining before next scheduled job
function getMsUntilNextMidnightUTC() {
    var now = new Date();
    var nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
    return nextMidnight.getTime() - now.getTime();
}
setInterval(function () {
    var now = new Date();
    var msUntil = getMsUntilNextMidnightUTC();
    var hours = Math.floor(msUntil / (1000 * 60 * 60));
    var minutes = Math.floor((msUntil % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((msUntil % (1000 * 60)) / 1000);
    console.log("[xMetricsScheduler] Heartbeat: ".concat(now.toISOString()));
    console.log("[xMetricsScheduler] Time remaining before scheduled job: ".concat(hours, "h ").concat(minutes, "m ").concat(seconds, "s"));
}, 60 * 60 * 1000); // every hour
// Also print time remaining immediately on startup
{
    var msUntil = getMsUntilNextMidnightUTC();
    var hours = Math.floor(msUntil / (1000 * 60 * 60));
    var minutes = Math.floor((msUntil % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((msUntil % (1000 * 60)) / 1000);
    console.log("[xMetricsScheduler] Time remaining before scheduled job: ".concat(hours, "h ").concat(minutes, "m ").concat(seconds, "s"));
}
// Scheduler for daily X (Twitter) metrics aggregation at 12am
var schedule = require("node-schedule");
// Dynamic import helpers for ESM modules
function getFetchTwitterListMetrics() {
    return __awaiter(this, void 0, void 0, function () {
        var mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sub/xApiClient.js"); })];
                case 1:
                    mod = _a.sent();
                    return [2 /*return*/, mod.fetchTwitterListMetrics];
            }
        });
    });
}
function getUpsertTweetAndMetrics() {
    return __awaiter(this, void 0, void 0, function () {
        var mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sub/xMetricsDb.js"); })];
                case 1:
                    mod = _a.sent();
                    return [2 /*return*/, mod.upsertTweetAndMetrics];
            }
        });
    });
}
function getAggregateEngagementMetrics() {
    return __awaiter(this, void 0, void 0, function () {
        var mod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./sub/xMetricsAggregator.js"); })];
                case 1:
                    mod = _a.sent();
                    return [2 /*return*/, mod.aggregateEngagementMetrics];
            }
        });
    });
}
// Helper: Get UNIX timestamps for previous day (00:00:00 to 23:59:59 UTC)
function getPreviousDayTimestamps() {
    var now = new Date();
    // Set to 00:00:00 today
    now.setUTCHours(0, 0, 0, 0);
    // Previous day start
    var start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    var sinceTime = Math.floor(start.getTime() / 1000); // seconds
    var untilTime = Math.floor(now.getTime() / 1000) - 1; // seconds, end of previous day
    return { sinceTime: sinceTime, untilTime: untilTime, dateString: start.toISOString().slice(0, 10) };
}
// Main scheduled job: runs every day at 12am UTC
schedule.scheduleJob("0 0 * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, sinceTime, untilTime, dateString, fetchTwitterListMetrics, upsertTweetAndMetrics, aggregateEngagementMetrics, tweets, _i, tweets_1, tweet, postData, url, aggResult, err_1;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                _r.trys.push([0, 10, , 11]);
                _a = getPreviousDayTimestamps(), sinceTime = _a.sinceTime, untilTime = _a.untilTime, dateString = _a.dateString;
                console.log("[xMetricsScheduler] Running daily job for ".concat(dateString, " (").concat(sinceTime, " - ").concat(untilTime, ")"));
                return [4 /*yield*/, getFetchTwitterListMetrics()];
            case 1:
                fetchTwitterListMetrics = _r.sent();
                return [4 /*yield*/, getUpsertTweetAndMetrics()];
            case 2:
                upsertTweetAndMetrics = _r.sent();
                return [4 /*yield*/, getAggregateEngagementMetrics()];
            case 3:
                aggregateEngagementMetrics = _r.sent();
                return [4 /*yield*/, fetchTwitterListMetrics(sinceTime, untilTime)];
            case 4:
                tweets = _r.sent();
                _i = 0, tweets_1 = tweets;
                _r.label = 5;
            case 5:
                if (!(_i < tweets_1.length)) return [3 /*break*/, 8];
                tweet = tweets_1[_i];
                postData = {
                    text: tweet.text,
                    postDate: dateString,
                    likes: (_c = (_b = tweet.public_metrics) === null || _b === void 0 ? void 0 : _b.likes) !== null && _c !== void 0 ? _c : 0,
                    retweets: (_e = (_d = tweet.public_metrics) === null || _d === void 0 ? void 0 : _d.retweets) !== null && _e !== void 0 ? _e : 0,
                    replies: (_g = (_f = tweet.public_metrics) === null || _f === void 0 ? void 0 : _f.replies) !== null && _g !== void 0 ? _g : 0,
                    views: (_j = (_h = tweet.public_metrics) === null || _h === void 0 ? void 0 : _h.impressions) !== null && _j !== void 0 ? _j : 0,
                    quotes: (_l = (_k = tweet.public_metrics) === null || _k === void 0 ? void 0 : _k.quotes) !== null && _l !== void 0 ? _l : 0,
                    bookmarks: (_o = (_m = tweet.public_metrics) === null || _m === void 0 ? void 0 : _m.bookmarks) !== null && _o !== void 0 ? _o : 0,
                    followers: (_q = (_p = tweet.public_metrics) === null || _p === void 0 ? void 0 : _p.followers) !== null && _q !== void 0 ? _q : 0,
                };
                url = "https://twitter.com/i/web/status/".concat(tweet.id);
                return [4 /*yield*/, upsertTweetAndMetrics(url, postData)];
            case 6:
                _r.sent();
                _r.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8: return [4 /*yield*/, aggregateEngagementMetrics()];
            case 9:
                aggResult = _r.sent();
                console.log("[xMetricsScheduler] Aggregation complete:", aggResult);
                return [3 /*break*/, 11];
            case 10:
                err_1 = _r.sent();
                console.error("[xMetricsScheduler] Error in scheduled job:", err_1);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
