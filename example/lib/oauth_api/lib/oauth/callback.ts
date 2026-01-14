import 'server-only';

import { TokenSet } from 'openid-client';
import logger from '../logger';
import { createOAuthClient, type OAuthClientConfig } from './client';

export interface ExchangeCodeResult<TProfile> {
    tokens: TokenSet;
    profile: TProfile;
}

/**
 * Exchange OAuth code for tokens
 * Reference: node_modules/next-auth/src/core/lib/oauth/callback.ts
 * Note: We skip PKCE and state checks since app has already completed authorization
 */
export async function exchangeOAuthCode<TProfile>(
    code: string,
    config: OAuthClientConfig
): Promise<ExchangeCodeResult<TProfile>> {
    try {
        const client = await createOAuthClient(config);

        // Skip PKCE and state checks because this module is for app only
        const params = {
            code,
        };

        // Use callback() to exchange code for tokens
        const tokens = await client.callback(config.callbackUrl, params, {});

        // Extract profile from id_token claims
        const profile = tokens.claims() as TProfile;
        if (profile && typeof profile === 'object' && 'sub' in profile && !profile.sub) {
            throw new Error('Profile id is missing in OAuth profile response');
        }

        return {
            tokens,
            profile,
        };
    } catch (error) {
        logger.error('Failed to exchange OAuth code:', error);
        throw new Error(`OAuth code exchange failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
