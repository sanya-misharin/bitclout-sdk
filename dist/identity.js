"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identity = exports.IdentityService = void 0;
const uuid_1 = require("uuid");
/**
 * This has been copied & adapted from the BitClout identity service
 * See: https://github.com/bitclout/frontend/blob/main/src/app/identity.service.ts
 */
class IdentityService {
    constructor() {
        // Requests that were sent before the iframe initialized
        this.pendingRequests = [];
        // All outbound request promises we still need to resolve
        this.outboundRequests = {};
        // The URL of the identity service
        this.identityServiceURL = "https://identity.deso.org/";
        this.initialized = false;
        this.iframe = null;
        // Wait for storageGranted broadcast
        // storageGranted = new Subject();
        // Using testnet or mainnet
        this.isTestnet = false;
        if (typeof window === "undefined")
            return;
        window.addEventListener("message", (event) => this.handleMessage(event));
    }
    // Launch a new identity window
    login({ accessLevel }) {
        return this.launch(`/log-in?accessLevelRequest=${accessLevel}`);
    }
    launch(path, params) {
        let url = this.identityServiceURL;
        if (path) {
            url += path;
        }
        let paramsStr = '';
        if (params === null || params === void 0 ? void 0 : params.tx) {
            paramsStr += `tx=${params.tx}`;
        }
        if (paramsStr.length > 0) {
            url += encodeURI(`?${paramsStr}`);
        }
        // center the window
        const h = 1000;
        const w = 800;
        const y = window.outerHeight / 2 + window.screenY - h / 2;
        const x = window.outerWidth / 2 + window.screenX - w / 2;
        let attributes = undefined;
        let t = this.getMobileOperatingSystem();
        if (t == 'iOS') {
            attributes = '_blank';
        }
        this.identityWindow = window.open(url, attributes, `toolbar=no, width=${w}, height=${h}, top=${y}, left=${x}`);
        const promise = new Promise((res, rej) => {
            this.identityWindowResolve = res;
        });
        return promise;
    }
    // Outgoing messages
    sign(payload) {
        return this.send("sign", payload);
    }
    // Incoming messages
    handleInitialize(event) {
        if (!this.initialized) {
            this.initialized = true;
            this.iframe = document.getElementById("identity");
            for (const request of this.pendingRequests) {
                this.postMessage(request);
            }
            this.pendingRequests = [];
        }
        // acknowledge, provides hostname data
        this.respond(event.source, event.data.id, {});
    }
    handleLogin(payload) {
        this.identityWindow.close();
        this.identityWindow = null;
        this.identityWindowResolve(payload);
        this.identityWindowResolve = null;
    }
    handleInfo(id) {
        this.respond(this.identityWindow, id, {});
    }
    // Message handling
    handleMessage(event) {
        const { data } = event;
        const { service, method } = data;
        if (service !== "identity") {
            return;
        }
        // Methods are present on incoming requests but not responses
        if (method) {
            this.handleRequest(event);
        }
        else {
            this.handleResponse(event);
        }
    }
    handleRequest(event) {
        const { data: { id, method, payload }, } = event;
        console.log(`handleRequest: ${method}`);
        if (method === "initialize") {
            this.handleInitialize(event);
            // } else if (method === "storageGranted") {
            // this.handleStorageGranted();
        }
        else if (method === "login") {
            this.handleLogin(payload);
        }
        else if (method === "info") {
            this.handleInfo(id);
        }
        else {
            console.error("Unhandled identity request");
            console.error(event);
        }
    }
    handleResponse(event) {
        const { data: { id, payload }, } = event;
        const { resolve, reject } = this.outboundRequests[id];
        resolve(payload);
        delete this.outboundRequests[id];
    }
    // Send a new message and expect a response
    send(method, payload) {
        const req = {
            id: (0, uuid_1.v4)(),
            method,
            payload,
            service: "identity",
        };
        const promise = new Promise((resolve, reject) => {
            this.postMessage(req);
            this.outboundRequests[req.id] = { resolve, reject };
        });
        return promise;
    }
    postMessage(req) {
        if (this.initialized) {
            this.iframe.contentWindow.postMessage(req, "*");
        }
        else {
            this.pendingRequests.push(req);
        }
    }
    // Respond to a received message
    respond(window, id, payload) {
        window.postMessage({ id, service: "identity", payload }, "*");
    }
    getMobileOperatingSystem() {
        const userAgent = navigator.userAgent || navigator.vendor || window['opera'];
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window['MSStream']) {
            return "iOS";
        }
        return "unknown";
    }
}
exports.IdentityService = IdentityService;
exports.identity = new IdentityService();
