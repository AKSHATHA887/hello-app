// TENANT_ID is hardcoded in the schematic depeding on prod/nonprod
const TENANT_ID = process.env.AZURE_TENANT; //  "f3211d0e-125b-42c3-86db-322b19a65a22";

// options.authority.toLowerCase() == 'ds' // staging
// ? f3211d0e-125b-42c3-86db-322b19a65a22'
// : // production
// 'e0793d39-0939-496d-b129-198edd916feb';

// this will be prompted of the end user
// e.g. AZURE_CLIENT_ID="93733604-cc77-4a3c-a604-87084dd55348"
const CLIENT_ID = process.env.AZURE_CLIENT_ID;

// this will be prompted of the end user
// e.g. AZURE_AUDIENCE=3bad5242-838d-4f49-b91d-04cc6e9f56b5,https://cioenterprisearchitecturecms.ciostage.accenture.com
const AUDIENCE = process.env.AZURE_AUDIENCE?.split(',');

// this will be prompted of the end user
// e.g. AZURE_SCOPES=rebar_serverless,eacatalog_api_read
//const SCOPES = process.env.AZURE_SCOPES.split(',');

export const securityConfig = {
  identityMetadata: `https://login.microsoftonline.com/${TENANT_ID}/v2.0/.well-known/openid-configuration/`,
  clientID: CLIENT_ID,
  validateIssuer: true,
  loggingNoPII: true,
  passReqToCallback: false,
  audience: AUDIENCE,
  tenantId: TENANT_ID,
  issuer: [
    `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
    `https://sts.windows.net/${TENANT_ID}/`,
  ]
  // ,
  // scope: SCOPES,
};
