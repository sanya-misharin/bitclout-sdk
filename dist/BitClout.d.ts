export declare class BitClout {
    baseUrl: string;
    constructor({ baseUrl }: {
        baseUrl?: string;
    });
    /**
     * Get BitClout exchange rate, total amount of nanos sold, and Bitcoin exchange rate.
     */
    getExchangeRate(): Promise<any>;
    /**
     * Get state of BitClout App, such as cost of profile creation and diamond level map.
     */
    getAppState(): Promise<any>;
    /**
     * Get hodling information about a specific Public Key (isHodlingPublicKey) given
     * a hodler Public Key (publicKey)
     */
    getIsHodlingPublicKey({ publicKey, isHodlingPublicKey, }: {
        publicKey: string;
        isHodlingPublicKey: string;
    }): Promise<any>;
    /**
     * Get information about single profile.
     */
    getSingleProfile({ publicKey, username, }: {
        publicKey?: string;
        username?: string;
    }): Promise<any>;
    /**
     * Get information about users. Request contains a list of public keys of users to fetch.
     */
    getUsersStateless({ publicKeys }: {
        publicKeys: string[];
    }): Promise<any>;
    /**
     * Get followers for given Public Key.
     */
    getFollowsStateless({ publicKey, getEntriesFollowingUsername, numToFetch, }: {
        publicKey: string;
        getEntriesFollowingUsername: boolean;
        numToFetch: number;
    }): Promise<any>;
    /**
     * Get BalanceEntryResponses for hodlings
     */
    getHoldersForPublicKey({ publicKey, username, numToFetch, fetchHodlings, lastPublicKey, fetchAll, }: {
        publicKey: string;
        username?: string;
        numToFetch: number;
        fetchHodlings?: boolean;
        lastPublicKey?: string;
        fetchAll?: boolean;
    }): Promise<any>;
    /**
     * Get notifications for a given public key.
     * All parameters are required to get a response.
     * fetchStartIndex can be set to -1.
     */
    getNotifications({ publicKey, fetchStartIndex, numToFetch, }: {
        publicKey: string;
        fetchStartIndex: number;
        numToFetch: number;
    }): Promise<any>;
    /**
     * Check if Txn is currently in mempool.
     */
    getTransaction({ txnHashHex }: {
        txnHashHex: string;
    }): Promise<any>;
    /**
     * Submit transaction to BitClout blockchain.
     */
    submitTransaction({ transactionHex }: {
        transactionHex: string;
    }): Promise<any>;
    private getClient;
}
