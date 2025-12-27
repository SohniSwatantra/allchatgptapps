import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';
import { authConfig } from './config';

export interface NeonAuthUser {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  iat?: number;
  exp?: number;
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

const getJWKS = () => {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(authConfig.jwksUrl));
  }
  return jwks;
};

export const verifyToken = async ({ token }: { token: string }): Promise<NeonAuthUser | null> => {
  try {
    const { payload } = await jwtVerify(token, getJWKS());

    return {
      sub: payload.sub as string,
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      picture: payload.picture as string | undefined,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
