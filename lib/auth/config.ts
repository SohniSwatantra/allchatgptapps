export const authConfig = {
  authUrl: process.env.NEON_AUTH_URL || 'https://ep-shiny-heart-aeuq3kw2.neonauth.c-2.us-east-2.aws.neon.tech/neondb/auth',
  jwksUrl: process.env.NEON_AUTH_JWKS_URL || 'https://ep-shiny-heart-aeuq3kw2.neonauth.c-2.us-east-2.aws.neon.tech/neondb/auth/.well-known/jwks.json',
};
