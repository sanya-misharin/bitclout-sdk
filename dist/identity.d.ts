/**
 * This has been copied & adapted from the BitClout identity service
 * See: https://github.com/bitclout/frontend/blob/main/src/app/identity.service.ts
 */
export declare class IdentityService {
    private pendingRequests;
    private outboundRequests;
    private identityWindow;
    private identityWindowResolve;
    identityServiceURL: string;
    private initialized;
    private iframe;
    isTestnet: boolean;
    constructor();
    login({ accessLevel }: {
        accessLevel: number;
    }): Promise<any>;
    launch(path?: string, params?: {
        tx?: string;
    }): Promise<any>;
    sign(payload: {
        accessLevel: number;
        accessLevelHmac: string;
        encryptedSeedHex: string;
        transactionHex: string;
    }): Promise<any>;
    private handleInitialize;
    private handleLogin;
    private handleInfo;
    private handleMessage;
    private handleRequest;
    private handleResponse;
    private send;
    private postMessage;
    private respond;
    private getMobileOperatingSystem;
}
export declare const identity: IdentityService;
