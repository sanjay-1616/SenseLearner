// Type declarations for Node.js built-in node:sqlite (Node 22.5+)

declare module 'node:sqlite' {
  export class DatabaseSync {
    constructor(location: string, options?: { open?: boolean });
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }

  export interface StatementSync {
    run(...params: any[]): { changes: number | bigint; lastInsertRowid: number | bigint };
    get(...params: any[]): Record<string, any> | undefined;
    all(...params: any[]): Record<string, any>[];
  }
}
