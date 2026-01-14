import 'server-only';

import { TokenSet } from 'openid-client';
import type { Client } from 'openid-client';
import type { OAuthClientConfig } from './client';
import logger from '../logger';

export interface IdTokenClaims {
    sub: string;
    email: string;
    email_verified: boolean;
    name?: string;
    picture?: string;
    [key: string]: unknown;
}

/**
 * Verify idToken using openid-client
 * Validates signature, expiration, issuer, audience, etc.
 * Uses the client's issuer information and config to validate the token
 */
export async function verifyIdToken(
    client: Client,
    idToken: string,
    config: OAuthClientConfig
): Promise<IdTokenClaims> {
    try {
        // Create a TokenSet with the idToken
        const tokenSet = new TokenSet({ id_token: idToken });
        
        // Get claims from the token
        const claims = tokenSet.claims();
        
        // Validate issuer if client has issuer information
        if (client.issuer?.metadata?.issuer && claims.iss) {
            const expectedIssuer = client.issuer.metadata.issuer;
            const tokenIssuer = typeof claims.iss === 'string' ? claims.iss : String(claims.iss);
            if (tokenIssuer !== expectedIssuer) {
                throw new Error(`idToken issuer mismatch: expected ${expectedIssuer}, got ${tokenIssuer}`);
            }
        }
        
        // Validate audience (client_id)
        if (claims.aud) {
            const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
            if (!audience.includes(config.clientId)) {
                throw new Error(`idToken audience mismatch: expected ${config.clientId}, got ${audience.join(', ')}`);
            }
        }
        
        // Additional validation
        if (!claims.sub) {
            throw new Error('idToken missing sub claim');
        }

        if (!claims.email) {
            throw new Error('idToken missing email claim');
        }

        // Validate expiration if present
        if (claims.exp && typeof claims.exp === 'number') {
            const now = Math.floor(Date.now() / 1000);
            if (claims.exp < now) {
                throw new Error(`idToken has expired, exp: ${claims.exp}`);
            }
        }

        return claims as IdTokenClaims;
    } catch (error) {
        logger.error('Failed to verify idToken:', error);
        throw new Error(`Invalid idToken: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
