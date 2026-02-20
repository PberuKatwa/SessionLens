export interface GlobalEnvironment{
  environment: string;
  port: string;
  cookieIdName: string;
}

export interface LLMApiEnvironment{
  geminiApiKey: string;
  kimiApiKey: string;
}

export interface PostgresEnv{
  pgHost: string;
  pgPort: string;
  pgUser: string;
  pgPassword: string;
  pgDatabase: string;
}

export type EnvConfig = PostgresEnv | GlobalEnvironment

export type SuffixChecker = (value:string,suffix:string) => boolean;
export type GlobalEnvironmentChecker = () => string;
export type GetEnv = (globalEnv:GlobalEnvironmentChecker, key: string) => string;
