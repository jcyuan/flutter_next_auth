import 'server-only';

import { Issuer, custom } from 'openid-client';
import type { Client } from 'openid-client';

export interface OAuthClientConfig {
    clientId: string;
    clientSecret: string;
    wellKnown?: string;
    callbackUrl: string;
    scope: string | string[];
    httpOptions?: {
        timeout?: number;
    };
}

/**
 * Create an OAuth client using openid-client
 * Reference: node_modules/next-auth/src/core/lib/oauth/client.ts
 */
export async function createOAuthClient(config: OAuthClientConfig): Promise<Client> {
    const { clientId, clientSecret, wellKnown, callbackUrl, httpOptions } = config;

    if (httpOptions) {
        custom.setHttpOptionsDefaults(httpOptions);
    }

    let issuer: Issuer;
    if (wellKnown) {
        issuer = await Issuer.discover(wellKnown);
    } else {
        throw new Error('wellKnown URL is required for OAuth client creation');
    }

    const client = new issuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [callbackUrl],
    });

    // allow a 10 second skew
    // See https://github.com/nextauthjs/next-auth/issues/3032
    // and https://github.com/nextauthjs/next-auth/issues/3067
    client[custom.clock_tolerance] = 10;

    return client;
}
