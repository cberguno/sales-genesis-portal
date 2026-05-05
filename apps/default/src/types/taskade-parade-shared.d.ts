declare module '@taskade/parade-shared' {
  export type LogFunction = (entry: LoggerEntryInput) => void;

  export interface LoggerEntryInput {
    level: 'error' | 'warn' | 'info' | 'debug';
    message: string;
    data?: SpaceAppLogLifecycleData;
  }

  export interface SpaceAppLogLifecycleData {
    code: string;
    message: string;
    stack?: string;
  }
}
