// 临时注释掉 PostgreSQL 相关导入
// import { Pool, QueryResult } from 'pg';

export class PostgresDatabase {
  // 暂时注释掉 PostgreSQL 实现，适用于浏览器环境
  // private pool: Pool;

  constructor(_config: { host: string; port: number; database: string; username: string; password: string }) {
    // 暂时忽略配置，因为浏览器端无法直接连接 PostgreSQL
    console.warn('PostgreSQL is not supported in browser environment');
    // this.pool = new Pool({
    //   host: config.host,
    //   port: config.port,
    //   database: config.database,
    //   user: config.username,
    //   password: config.password,
    //   max: 10,
    // });
  }

  async connect(): Promise<void> {
    // Pool connects automatically on first query
    throw new Error('PostgreSQL is not supported in browser environment');
  }

  async query<T>(_sql: string, _params: any[] = []): Promise<T[]> {
    throw new Error('PostgreSQL is not supported in browser environment');
  }

  async execute(_sql: string, _params: any[] = []): Promise<void> {
    throw new Error('PostgreSQL is not supported in browser environment');
  }

  async close(): Promise<void> {
    // await this.pool.end();
  }
}
