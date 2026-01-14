import 'server-only';

import type { OAuthClientConfig } from './client';
import config from '@/config';
import secretsConfig from '@/config.secrets';

export type OAuthProvider = 'google' | 'apple' | 'microsoft' | 'linkedin' | 'github' | 'twitter' | 'facebook';

export const oauthProviders: Partial<Record<OAuthProvider, OAuthClientConfig>> = {
    google: {
        clientId: config.auth.googleAuth!.clientId!,
        clientSecret: secretsConfig.auth.googleAuth.clientSecret,
        wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
        callbackUrl: `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}${config.domainName}/api/auth/oauth`,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
        httpOptions: {
            timeout: 4000,
        },
    }
};
