import { ColumnDef, QueryDiff, QueryResult, TableSchema } from "./types";

declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<any>;
  }
}

// SQL.js instance types
type SqlJsDatabase = any;

const UNIVERSITY_SCHEMA = `
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    department_name TEXT NOT NULL,
    building TEXT NOT NULL,
    budget NUMERIC(12, 2) NOT NULL
);

CREATE TABLE instructors (
    id INTEGER PRIMARY KEY,
    instructor_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department_id INTEGER,
    salary NUMERIC(10, 2),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    student_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department_id INTEGER,
    enrollment_year INTEGER NOT NULL,
    gpa NUMERIC(3, 2) DEFAULT 0.0,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY,
    course_code TEXT UNIQUE NOT NULL,
    course_title TEXT NOT NULL,
    department_id INTEGER,
    credits INTEGER DEFAULT 3,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    semester TEXT NOT NULL,
    grade NUMERIC(3, 2),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Seed Data
INSERT INTO departments VALUES 
(1, 'Computer Science & Engineering', 'Turing Hall', 850000.00),
(2, 'Electrical & Computer Engineering', 'Maxwell Building', 720000.00),
(3, 'Information Systems', 'Hopper Hall', 480000.00),
(4, 'Mathematics & Statistics', 'Euler Pavilion', 350000.00);

INSERT INTO instructors VALUES
(201, 'Dr. Sarah Connor', 's.connor@univ.edu', 1, 95000.00),
(202, 'Dr. Alan Turing', 'a.turing@univ.edu', 1, 120000.00),
(203, 'Prof. Claude Shannon', 'c.shannon@univ.edu', 2, 110000.00),
(204, 'Dr. Ada Lovelace', 'a.lovelace@univ.edu', 3, 98000.00);

INSERT INTO students VALUES
(101, 'Alex Mercer', 'alex.m@univ.edu', 1, 2024, 3.82),
(102, 'Elena Rostova', 'elena.r@univ.edu', 2, 2023, 3.95),
(103, 'Marcus Vance', 'marcus.v@univ.edu', 1, 2024, 3.45),
(104, 'Zoe Washington', 'zoe.w@univ.edu', 3, 2025, 3.68),
(105, 'Kiran Patel', 'kiran.p@univ.edu', 4, 2023, 3.12);

INSERT INTO courses VALUES
(301, 'CS101', 'Intro to Relational Databases & SQL', 1, 4),
(302, 'CS204', 'Data Structures & Algorithms', 1, 4),
(303, 'ECE310', 'Embedded Systems & Microcontrollers', 2, 3),
(304, 'IS220', 'Business Intelligence & ETL Systems', 3, 3),
(305, 'MATH201', 'Discrete Mathematics & Graph Theory', 4, 3);

INSERT INTO enrollments VALUES
(1, 101, 301, 'Fall 2025', 3.8),
(2, 101, 302, 'Fall 2025', 3.7),
(3, 102, 301, 'Fall 2025', 4.0),
(4, 102, 303, 'Spring 2026', 3.9),
(5, 103, 301, 'Fall 2025', 3.5),
(6, 104, 304, 'Spring 2026', 3.8),
(7, 105, 305, 'Fall 2025', 2.8);
`;

const RETAIL_SCHEMA = `
CREATE TABLE regions (
    id INTEGER PRIMARY KEY,
    region_name TEXT NOT NULL,
    country TEXT NOT NULL,
    manager TEXT NOT NULL
);

CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    customer_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    region_id INTEGER,
    signup_date TEXT NOT NULL,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date TEXT NOT NULL,
    status TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Seed Data
INSERT INTO regions VALUES
(1, 'North America - East', 'USA', 'James Wilson'),
(2, 'North America - West', 'USA', 'Maya Lin'),
(3, 'Europe Central', 'Germany', 'Hans Gruber'),
(4, 'Asia Pacific', 'Singapore', 'Chen Wei');

INSERT INTO customers VALUES
(1, 'Apex Logistics Corp', 'billing@apex.io', 'New York', 1, '2024-01-15'),
(2, 'BioMed Innovations', 'purchasing@biomed.de', 'Berlin', 3, '2024-02-20'),
(3, 'Cascade Retail LLC', 'orders@cascaderetail.com', 'Seattle', 2, '2024-03-10'),
(4, 'Delta Energy Partners', 'procure@delta.sg', 'Singapore', 4, '2024-04-05'),
(5, 'Epsilon Digital', 'accounts@epsilondigital.com', 'Boston', 1, '2024-05-12');

INSERT INTO products VALUES
(101, 'Industrial Gateway Node X1', 'Hardware', 450.00, 120),
(102, 'Enterprise Analytics Suite', 'Software', 1200.00, 999),
(103, 'Thermal Sensor Array', 'Hardware', 180.00, 350),
(104, 'PostgreSQL Performance Proxy', 'Software', 750.00, 500),
(105, 'Cloud Connector Bridge', 'Hardware', 320.00, 85);

INSERT INTO orders VALUES
(1001, 1, '2025-01-10', 'DELIVERED', 1650.00),
(1002, 2, '2025-01-14', 'DELIVERED', 2400.00),
(1003, 3, '2025-02-01', 'DELIVERED', 810.00),
(1004, 4, '2025-02-18', 'SHIPPED', 4500.00),
(1005, 5, '2025-03-02', 'PROCESSING', 1520.00);

INSERT INTO order_items VALUES
(1, 1001, 101, 2, 450.00),
(2, 1001, 104, 1, 750.00),
(3, 1002, 102, 2, 1200.00),
(4, 1003, 103, 3, 180.00),
(5, 1003, 105, 1, 320.00),
(6, 1004, 102, 3, 1200.00),
(7, 1004, 101, 2, 450.00),
(8, 1005, 104, 2, 750.00);
`;

// Pure in-memory SQL state wrapper
class SqlEngineManager {
  private SQL: any = null;
  private currentDb: SqlJsDatabase = null;
  private currentDbType: "university" | "retail" = "university";
  private isInitializing: boolean = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.currentDb) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      // Dynamic import of sql.js in browser
      const initSqlJs = (await import("sql.js")).default;
      try {
        this.SQL = await initSqlJs({
          locateFile: (file: string) => `/${file}`,
        });
      } catch (wasmErr) {
        console.warn("Local sql-wasm.wasm load failed, falling back to CDN:", wasmErr);
        this.SQL = await initSqlJs({
          locateFile: () => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm`,
        });
      }
      this.resetDatabase(this.currentDbType);
    })();

    return this.initPromise;
  }

  resetDatabase(dbType: "university" | "retail" = "university"): void {
    if (!this.SQL) return;
    if (this.currentDb) {
      this.currentDb.close();
    }
    this.currentDbType = dbType;
    this.currentDb = new this.SQL.Database();
    const schema = dbType === "retail" ? RETAIL_SCHEMA : UNIVERSITY_SCHEMA;
    this.currentDb.run(schema);
  }

  getDatabaseType(): "university" | "retail" {
    return this.currentDbType;
  }

  setDatabaseType(type: "university" | "retail"): void {
    if (type !== this.currentDbType) {
      this.resetDatabase(type);
    }
  }

  getSchema(): TableSchema[] {
    if (!this.currentDb) return [];
    try {
      const tablesRes = this.currentDb.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
      if (!tablesRes || tablesRes.length === 0 || !tablesRes[0].values) return [];

      const schemas: TableSchema[] = [];
      for (const row of tablesRes[0].values) {
        const tableName = String(row[0]);
        // Table info PRAGMA
        const infoRes = this.currentDb.exec(`PRAGMA table_info(${tableName});`);
        const countRes = this.currentDb.exec(`SELECT COUNT(*) FROM ${tableName};`);
        const sampleRes = this.currentDb.exec(`SELECT * FROM ${tableName} LIMIT 5;`);

        const columns: ColumnDef[] = [];
        if (infoRes && infoRes.length > 0) {
          for (const colRow of infoRes[0].values) {
            columns.push({
              name: String(colRow[1]),
              type: String(colRow[2]),
              notNull: Boolean(colRow[3]),
              primaryKey: Boolean(colRow[5]),
            });
          }
        }

        const rowCount = countRes && countRes[0]?.values[0] ? Number(countRes[0].values[0][0]) : 0;
        
        const sampleRows: Record<string, unknown>[] = [];
        if (sampleRes && sampleRes[0]) {
          const colNames = sampleRes[0].columns;
          for (const sRow of sampleRes[0].values) {
            const obj: Record<string, unknown> = {};
            colNames.forEach((c: string, idx: number) => {
              obj[c] = sRow[idx];
            });
            sampleRows.push(obj);
          }
        }

        schemas.push({
          name: tableName,
          columns,
          rowCount,
          sampleRows,
        });
      }
      return schemas;
    } catch (e) {
      console.error("Error reading schema:", e);
      return [];
    }
  }

  execute(query: string): QueryResult {
    if (!this.currentDb) {
      return {
        columns: [],
        values: [],
        rowsAffected: 0,
        executionTimeMs: 0,
        error: "SQL Engine initializing. Please wait a moment...",
      };
    }

    const trimmed = query.trim();
    if (!trimmed) {
      return {
        columns: [],
        values: [],
        rowsAffected: 0,
        executionTimeMs: 0,
        error: "Query is empty.",
      };
    }

    // Determine primary operation
    const firstWord = trimmed.split(/[\s;]+/)[0].toUpperCase();
    const op = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP", "WITH", "BEGIN", "COMMIT", "ROLLBACK"].includes(firstWord)
      ? (firstWord as any)
      : "OTHER";

    // Detect target table
    let targetTable = "";
    const fromMatch = trimmed.match(/(?:FROM|INTO|UPDATE|TABLE)\s+([a-zA-Z0-9_]+)/i);
    if (fromMatch) {
      targetTable = fromMatch[1];
    }

    // Capture state before mutation if applicable
    let rowsBefore: Record<string, unknown>[] = [];
    if (targetTable && ["INSERT", "UPDATE", "DELETE"].includes(op)) {
      try {
        const pre = this.currentDb.exec(`SELECT * FROM ${targetTable};`);
        if (pre && pre[0]) {
          const cols = pre[0].columns;
          rowsBefore = pre[0].values.map((row: any[]) => {
            const obj: Record<string, unknown> = {};
            cols.forEach((c: string, idx: number) => {
              obj[c] = row[idx];
            });
            return obj;
          });
        }
      } catch {
        // Table might not exist yet
      }
    }

    const startTime = performance.now();
    try {
      // Execute query
      const results = this.currentDb.exec(trimmed);
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

      // Rows affected calculation
      const changesRes = this.currentDb.exec("SELECT changes();");
      const rowsAffected = changesRes && changesRes[0]?.values[0] ? Number(changesRes[0].values[0][0]) : 0;

      let columns: string[] = [];
      let values: (string | number | boolean | null)[][] = [];

      if (results && results.length > 0) {
        // Last statement output
        const lastResult = results[results.length - 1];
        columns = lastResult.columns;
        values = lastResult.values;
      }

      // Compute diff if mutated
      let diff: QueryDiff | null = null;
      if (["INSERT", "UPDATE", "DELETE"].includes(op) && targetTable) {
        try {
          const post = this.currentDb.exec(`SELECT * FROM ${targetTable};`);
          const rowsAfter: Record<string, unknown>[] = [];
          if (post && post[0]) {
            const cols = post[0].columns;
            for (const row of post[0].values) {
              const obj: Record<string, unknown> = {};
              cols.forEach((c: string, idx: number) => {
                obj[c] = row[idx];
              });
              rowsAfter.push(obj);
            }
          }

          if (op === "INSERT") {
            const inserted = rowsAfter.slice(rowsBefore.length);
            diff = {
              operation: "INSERT",
              targetTable,
              rowsAffected,
              insertedRows: inserted,
            };
          } else if (op === "DELETE") {
            const currentIds = new Set(rowsAfter.map((r) => r.id ?? JSON.stringify(r)));
            const deleted = rowsBefore.filter((r) => !currentIds.has(r.id ?? JSON.stringify(r)));
            diff = {
              operation: "DELETE",
              targetTable,
              rowsAffected,
              deletedRows: deleted,
            };
          } else if (op === "UPDATE") {
            const modifiedCells: any[] = [];
            rowsAfter.forEach((afterRow, idx) => {
              const beforeRow = rowsBefore[idx];
              if (beforeRow) {
                Object.keys(afterRow).forEach((k) => {
                  if (afterRow[k] !== beforeRow[k]) {
                    modifiedCells.push({
                      rowIndex: idx,
                      columnName: k,
                      oldValue: beforeRow[k],
                      newValue: afterRow[k],
                    });
                  }
                });
              }
            });
            diff = {
              operation: "UPDATE",
              targetTable,
              rowsAffected,
              modifiedCells,
            };
          }
        } catch {
          // ignore diff error
        }
      }

      const explanation = this.generateExplanation(op, trimmed, targetTable, columns.length, values.length, rowsAffected, executionTimeMs);

      return {
        columns,
        values,
        rowsAffected,
        executionTimeMs,
        diff,
        explanation,
      };
    } catch (err: any) {
      const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        columns: [],
        values: [],
        rowsAffected: 0,
        executionTimeMs,
        error: err?.message || String(err),
        explanation: `Execution halted due to syntax or constraint violation: ${err?.message || err}`,
      };
    }
  }

  private generateExplanation(
    op: string,
    sql: string,
    targetTable: string,
    colCount: number,
    rowCount: number,
    rowsAffected: number,
    timeMs: number
  ): string {
    const sLower = sql.toLowerCase();
    
    if (op === "SELECT" || sLower.startsWith("with")) {
      const hasJoin = sLower.includes("join");
      const hasWhere = sLower.includes("where");
      const hasGroupBy = sLower.includes("group by");
      const hasOrderBy = sLower.includes("order by");

      let details = `Executed SELECT query returning ${rowCount} row(s) and ${colCount} column(s) in ${timeMs}ms.`;
      if (hasJoin) {
        details += " Matched relational keys across joined tables.";
      }
      if (hasWhere) {
        details += " Applied WHERE predicate filters.";
      }
      if (hasGroupBy) {
        details += " Partitioned source rows into aggregate summary buckets.";
      }
      if (hasOrderBy) {
        details += " Sorted final result set according to specified sort keys.";
      }
      return details;
    }

    if (op === "INSERT") {
      return `Executed INSERT statement against '${targetTable}'. Successfully added ${rowsAffected} new record(s). Schema constraints and data types were verified.`;
    }

    if (op === "UPDATE") {
      if (rowsAffected === 0) {
        return `Executed UPDATE on '${targetTable}', but 0 rows matched the WHERE condition. No records were modified.`;
      }
      return `Executed UPDATE on '${targetTable}'. Modified ${rowsAffected} matching row(s). Cell mutations are recorded below.`;
    }

    if (op === "DELETE") {
      if (rowsAffected === 0) {
        return `Executed DELETE on '${targetTable}', but 0 rows matched the condition. No records were removed.`;
      }
      return `Executed DELETE on '${targetTable}'. Permanently removed ${rowsAffected} record(s) matching the criteria.`;
    }

    if (op === "CREATE") {
      return `Executed DDL statement. New table or index structure created in the relational schema.`;
    }

    if (op === "ALTER") {
      return `Executed ALTER TABLE statement. Table schema definition successfully updated.`;
    }

    if (op === "DROP") {
      return `Executed DROP statement. Table and its associated index metadata were purged from database.`;
    }

    return `Executed SQL statement successfully in ${timeMs}ms (${rowsAffected} rows affected).`;
  }
}

export const sqlEngine = new SqlEngineManager();

export async function executeQuery(
  query: string,
  dbType: "university" | "retail" = "university"
): Promise<QueryResult> {
  await sqlEngine.init();
  if (dbType) sqlEngine.setDatabaseType(dbType);
  return sqlEngine.execute(query);
}

export async function resetDatabase(
  dbType: "university" | "retail" = "university"
): Promise<void> {
  await sqlEngine.init();
  sqlEngine.resetDatabase(dbType);
}

export async function getTableSchemas(
  dbType: "university" | "retail" = "university"
): Promise<TableSchema[]> {
  await sqlEngine.init();
  if (dbType) sqlEngine.setDatabaseType(dbType);
  return sqlEngine.getSchema();
}

