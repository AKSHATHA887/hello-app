export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTOAPI_CONFIG: string;
    }
  }
}