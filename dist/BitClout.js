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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitClout = void 0;
const axios_1 = require("axios");
const DEFAULT_NODE_URL = "https://bitclout.com/api";
let client;
class BitClout {
    constructor({ baseUrl = DEFAULT_NODE_URL }) {
        this.baseUrl = baseUrl;
    }
    /**
     * Get BitClout exchange rate, total amount of nanos sold, and Bitcoin exchange rate.
     */
    getExchangeRate() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "/v0/get-exchange-rate";
            const result = yield this.getClient().get(path);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Get state of BitClout App, such as cost of profile creation and diamond level map.
     */
    getAppState() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "/v0/get-app-state";
            const result = yield this.getClient().post(path, {});
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Get hodling information about a specific Public Key (isHodlingPublicKey) given
     * a hodler Public Key (publicKey)
     */
    getIsHodlingPublicKey({ publicKey, isHodlingPublicKey, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!publicKey) {
                throw new Error("publicKey is required");
            }
            if (!isHodlingPublicKey) {
                throw new Error("isHodlingPublicKey is required");
            }
            const path = "/v0/is-hodling-public-key";
            const data = {
                PublicKeyBase58Check: publicKey,
                IsHodlingPublicKeyBase58Check: isHodlingPublicKey,
            };
            const result = yield this.getClient().post(path, data);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Get information about single profile.
     */
    getSingleProfile({ publicKey, username, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!publicKey && !username)
                throw new Error("publicKey or username is required");
            const path = "/v0/get-single-profile";
            const data = {};
            if (publicKey) {
                data.PublicKeyBase58Check = publicKey;
            }
            else if (username) {
                data.username = username;
            }
            const result = yield this.getClient().post(path, data);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Get information about users. Request contains a list of public keys of users to fetch.
     */
    getUsersStateless({ publicKeys }) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "/v0/get-users-stateless";
            const data = {
                PublicKeysBase58Check: publicKeys,
                SkipForLeaderboard: true,
            };
            const result = yield this.getClient().post(path, data);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Get followers for given Public Key.
     */
    getFollowsStateless({ publicKey, getEntriesFollowingUsername, numToFetch, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "/v0/get-follows-stateless";
            const data = {
                PublicKeyBase58Check: publicKey,
                GetEntriesFollowingUsername: getEntriesFollowingUsername,
                NumToFetch: numToFetch,
            };
            const result = yield this.getClient().post(path, data);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Get BalanceEntryResponses for hodlings
     */
    getHoldersForPublicKey({ publicKey, username, numToFetch, fetchHodlings, lastPublicKey, fetchAll, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!publicKey && !username) {
                throw new Error("publicKey or username are required");
            }
            if (!numToFetch) {
                throw new Error("numToFetch is required");
            }
            const path = "/v0/get-hodlers-for-public-key";
            const data = {
                Username: username,
                FetchAll: fetchAll,
                PublicKeyBase58Check: publicKey,
                NumToFetch: numToFetch,
                LastPublicKeyBase58Check: lastPublicKey,
                FetchHodlings: fetchHodlings,
            };
            const result = yield this.getClient().post(path, data);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Get notifications for a given public key.
     * All parameters are required to get a response.
     * fetchStartIndex can be set to -1.
     */
    getNotifications({ publicKey, fetchStartIndex, numToFetch, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!publicKey) {
                throw new Error("publicKey is required");
            }
            if (!fetchStartIndex) {
                throw new Error("fetchStartIndex is required");
            }
            if (!numToFetch) {
                throw new Error("numToFetch is required");
            }
            const path = "/v0/get-notifications";
            const data = {
                PublicKeyBase58Check: publicKey,
                FetchStartIndex: fetchStartIndex,
                NumToFetch: numToFetch,
            };
            const result = yield this.getClient().post(path, data);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Check if Txn is currently in mempool.
     */
    getTransaction({ txnHashHex }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!txnHashHex) {
                throw new Error("txnHashHex is required");
            }
            const path = "/v0/get-txn";
            const data = {
                TxnHashHex: txnHashHex,
            };
            const result = yield this.getClient().post(path, data);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    /**
     * Submit transaction to BitClout blockchain.
     */
    submitTransaction({ transactionHex }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!transactionHex) {
                throw new Error("transactionHex is required");
            }
            const path = "/v0/submit-transaction";
            const data = {
                TransactionHex: transactionHex,
            };
            const result = yield this.getClient().post(path, data);
            return result === null || result === void 0 ? void 0 : result.data;
        });
    }
    getClient() {
        if (client)
            return client;
        client = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Accept-Encoding": "gzip",
            },
        });
        return client;
    }
}
exports.BitClout = BitClout;
