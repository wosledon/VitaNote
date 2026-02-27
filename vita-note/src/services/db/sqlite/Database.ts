// 浏览器端 SQLite 实现（使用 localStorage 模拟）
// 由于 sql.js 的 wasm 文件在 Vite 中加载有问题，我们使用纯 JavaScript 方案

interface DatabaseTable {
  name: string;
  columns: Map<string, string>;
  rows: any[];
}

interface Database {
  tables: Map<string, DatabaseTable>;
}

export class SQLiteDatabase {
  private dbPath: string;
  private db: Database | null = null;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || 'vitanote.db';
  }

  async connect(): Promise<void> {
    // 从 localStorage 加载数据库
    const savedDb = localStorage.getItem(this.dbPath);
    
    if (savedDb) {
      try {
        const parsed = JSON.parse(savedDb);
        // 将普通对象转换回 Map
        this.db = {
          tables: new Map(parsed.tables.map((t: any) => [
            t.name,
            {
              name: t.name,
              columns: new Map(t.columns),
              rows: t.rows
            }
          ]))
        };
        console.log('Database loaded from localStorage');
      } catch (error) {
        console.warn('Failed to load database, creating new one:', error);
        this.db = { tables: new Map() };
      }
    } else {
      this.db = { tables: new Map() };
    }
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    try {
      // 解析 CREATE TABLE 语句
      const createTableMatch = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)\s*\(([\s\S]+)\)/i);
      if (createTableMatch) {
        const tableName = createTableMatch[1];
        const columnsStr = createTableMatch[2];
        
        const columns = new Map<string, string>();
        // 解析列定义
        const columnDefs = columnsStr.split(',').map(c => c.trim());
        for (const def of columnDefs) {
          const parts = def.split(/\s+/);
          const colName = parts[0].toLowerCase();
          const colType = parts[1] || 'TEXT';
          columns.set(colName, colType);
        }
        
        this.db.tables.set(tableName, {
          name: tableName,
          columns,
          rows: []
        });
        
        this.saveDatabase();
        return;
      }

      // 解析 INSERT 语句
      const insertMatch = sql.match(/INSERT INTO (\w+)\s*\(([\s\S]+?)\)\s*VALUES\s*\(([\s\S]+?)\)/i);
      if (insertMatch) {
        const tableName = insertMatch[1];
        const columns = insertMatch[2].split(',').map(c => c.trim());
        const values = insertMatch[3].split(',').map((v: string, i: number) => {
          const val = v.trim();
          if (val === '?') {
            return params[i] !== undefined ? params[i] : null;
          }
          // 处理字符串值（去掉引号）
          if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
            return val.slice(1, -1);
          }
          return val;
        });

        const table = this.db.tables.get(tableName);
        if (!table) {
          throw new Error(`Table ${tableName} not found`);
        }

        const row: any = {};
        columns.forEach((col, i) => {
          row[col.toLowerCase()] = values[i];
        });
        row.id = row.id || crypto.randomUUID();
        table.rows.push(row);
        
        this.saveDatabase();
        return;
      }

      // 解析 UPDATE 语句
      const updateMatch = sql.match(/UPDATE (\w+)\s+SET\s+([\s\S]+?)\s+WHERE\s+(\w+)\s*=\s*\?/i);
      if (updateMatch) {
        const tableName = updateMatch[1];
        const setClause = updateMatch[2];
        const whereColumn = updateMatch[3];
        const whereValue = params[params.length - 1];

        const table = this.db.tables.get(tableName);
        if (!table) {
          throw new Error(`Table ${tableName} not found`);
        }

        // 解析 SET 子句
        const sets = setClause.split(',').map(s => s.trim());
        const updates: any = {};
        sets.forEach((set, i) => {
          const [col, val] = set.split(/\s*=\s*/);
          if (val === '?') {
            updates[col.toLowerCase()] = params[i];
          } else {
            updates[col.toLowerCase()] = val?.replace(/['"]/g, '');
          }
        });

        // 更新匹配的行
        const rowIndex = table.rows.findIndex(r => r[whereColumn.toLowerCase()] === whereValue);
        if (rowIndex !== -1) {
          table.rows[rowIndex] = { ...table.rows[rowIndex], ...updates };
          this.saveDatabase();
        }
        return;
      }

      // 解析 DELETE 语句
      const deleteMatch = sql.match(/DELETE FROM (\w+)\s+WHERE\s+(\w+)\s*=\s*\?/i);
      if (deleteMatch) {
        const tableName = deleteMatch[1];
        const whereColumn = deleteMatch[2];
        const whereValue = params[0];

        const table = this.db.tables.get(tableName);
        if (!table) {
          throw new Error(`Table ${tableName} not found`);
        }

        table.rows = table.rows.filter(r => r[whereColumn.toLowerCase()] !== whereValue);
        this.saveDatabase();
        return;
      }

      console.warn('Unsupported SQL statement:', sql);
    } catch (error) {
      console.error('Execute error:', error);
      throw error;
    }
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    try {
      // 解析 SELECT 语句
      const selectMatch = sql.match(/SELECT\s+([\s\S]+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+([\s\S]+?))?(?:\s+ORDER BY\s+([\s\S]+?))?(?:\s+LIMIT\s+(\d+))?(?:\s+OFFSET\s+(\d+))?/i);
      
      if (selectMatch) {
        const columns = selectMatch[1].trim();
        const tableName = selectMatch[2];
        const whereClause = selectMatch[3];
        const orderBy = selectMatch[4];
        const limit = selectMatch[5] ? parseInt(selectMatch[5]) : null;
        const offset = selectMatch[6] ? parseInt(selectMatch[6]) : null;

        const table = this.db.tables.get(tableName);
        if (!table) {
          throw new Error(`Table ${tableName} not found`);
        }

        let results = [...table.rows];

        // 应用 WHERE 子句
        if (whereClause) {
          const whereConditions = whereClause.split(/\s+AND\s+/i);
          for (const condition of whereConditions) {
            const match = condition.match(/(\w+)\s*(=|>=|<=|>|<|LIKE)\s*(\?|['"]?[^'"]+['"]?)/i);
            if (match) {
              const col = match[1].toLowerCase();
              const op = match[2];
              let val = match[3];
              
              if (val === '?') {
                val = params.shift();
              } else {
                val = val?.replace(/['"]/g, '');
              }

              results = results.filter(r => {
                const rowVal = r[col];
                switch (op) {
                  case '=': return rowVal == val;
                  case '>=': return rowVal >= val;
                  case '<=': return rowVal <= val;
                  case '>': return rowVal > val;
                  case '<': return rowVal < val;
                  case 'LIKE': return String(rowVal).includes(String(val).replace(/%/g, ''));
                  default: return true;
                }
              });
            }
          }
        }

        // 应用 ORDER BY
        if (orderBy) {
          const orderParts = orderBy.split(',');
          for (const part of orderParts) {
            const [col, dir] = part.trim().split(/\s+/);
            const direction = dir?.toUpperCase() === 'DESC' ? -1 : 1;
            results.sort((a, b) => {
              const aVal = a[col?.toLowerCase()];
              const bVal = b[col?.toLowerCase()];
              if (aVal < bVal) return -1 * direction;
              if (aVal > bVal) return 1 * direction;
              return 0;
            });
          }
        }

        // 应用 OFFSET 和 LIMIT
        if (offset) results = results.slice(offset);
        if (limit) results = results.slice(0, limit);

        // 选择特定列（如果是 SELECT * 则返回所有列）
        if (columns !== '*') {
          const selectedCols = columns.split(',').map(c => c.trim().toLowerCase());
          results = results.map(r => {
            const newRow: any = {};
            selectedCols.forEach(col => {
              if (r[col] !== undefined) newRow[col] = r[col];
            });
            return newRow;
          });
        }

        return results as T[];
      }

      // 解析 COUNT 查询
      const countMatch = sql.match(/SELECT\s+COUNT\(\*\)\s+as\s+count\s+FROM\s+(\w+)(?:\s+WHERE\s+([\s\S]+?))?/i);
      if (countMatch) {
        const tableName = countMatch[1];
        const whereClause = countMatch[2];

        const table = this.db.tables.get(tableName);
        if (!table) {
          throw new Error(`Table ${tableName} not found`);
        }

        let count = table.rows.length;

        // 应用 WHERE 子句
        if (whereClause) {
          const whereConditions = whereClause.split(/\s+AND\s+/i);
          for (const condition of whereConditions) {
            const match = condition.match(/(\w+)\s*(=|>=|<=|>|<)\s*(\?|['"]?[^'"]+['"]?)/i);
            if (match) {
              const col = match[1].toLowerCase();
              const op = match[2];
              let val = match[3];
              
              if (val === '?') {
                val = params.shift();
              } else {
                val = val?.replace(/['"]/g, '');
              }

              count = table.rows.filter(r => {
                const rowVal = r[col];
                switch (op) {
                  case '=': return rowVal == val;
                  case '>=': return rowVal >= val;
                  case '<=': return rowVal <= val;
                  case '>': return rowVal > val;
                  case '<': return rowVal < val;
                  default: return true;
                }
              }).length;
            }
          }
        }

        return [{ count }] as T[];
      }

      console.warn('Unsupported SELECT statement:', sql);
      return [];
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    this.saveDatabase();
    this.db = null;
  }

  private saveDatabase(): void {
    if (this.db) {
      // 将 Map 转换为普通对象以便 JSON 序列化
      const serialized = {
        tables: Array.from(this.db.tables.entries()).map(([name, table]) => ({
          name,
          columns: Array.from(table.columns.entries()),
          rows: table.rows
        }))
      };
      localStorage.setItem(this.dbPath, JSON.stringify(serialized));
    }
  }
}
