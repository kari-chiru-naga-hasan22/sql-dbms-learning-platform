export interface LessonSummary {
  id: number;
  lessonNumber: number;
  title: string;
  type: string;
  slug: string;
  interactiveType: string;
  sectionsCount: number;
}

export interface ModuleSummary {
  moduleId: number;
  moduleNumber: number;
  overallOrder: number;
  title: string;
  description: string;
  lessons: LessonSummary[];
}

export interface WeekSummary {
  weekNumber: number;
  title: string;
  modules: ModuleSummary[];
}

export interface TabData {
  tab_id?: number | string;
  tab_title: string;
  tab_content_html?: string;
  tab_content_markdown: string;
}

export interface ResourceData {
  type: string;
  filename: string;
  source_url: string;
  local_path: string;
  sha256: string;
  size: number;
}

export interface SectionData {
  section_id?: number;
  order: number;
  type: string;
  title?: string | null;
  description_markdown: string;
  tabs?: TabData[];
  resources?: ResourceData[];
}

export interface AssessmentOption {
  id: number | string;
  text: string;
  is_correct?: boolean;
}

export interface AssessmentQuestion {
  id?: number | string;
  question: string;
  question_type?: string;
  options: AssessmentOption[];
  explanation?: string;
}

export interface AssessmentData {
  questions_count: number;
  questions: AssessmentQuestion[];
}

export interface SampleQuery {
  label: string;
  sql: string;
}

export interface LabConfig {
  defaultQuery: string;
  sampleQueries: SampleQuery[];
  targetDatabase: "university" | "retail" | "general";
}

export interface LessonDetail {
  id: number;
  weekNumber: number;
  moduleNumber: number;
  overallOrder: number;
  lessonNumber: number;
  slug: string;
  title: string;
  type: string;
  moduleTitle: string;
  moduleDescription: string;
  weekTitle: string;
  objective: string;
  interactiveType: string;
  labConfig: LabConfig;
  sectionsCount: number;
  sections: SectionData[];
  assessment?: AssessmentData | null;
  prevSlug?: string | null;
  prevTitle?: string | null;
  nextSlug?: string | null;
  nextTitle?: string | null;
}

export interface CourseData {
  title: string;
  totalWeeks: number;
  totalModules: number;
  totalLessons: number;
  weeks: WeekSummary[];
  lessons: LessonDetail[];
}

export interface ColumnDef {
  name: string;
  type: string;
  primaryKey?: boolean;
  notNull?: boolean;
  foreignKey?: string;
}

export interface TableSchema {
  name: string;
  columns: ColumnDef[];
  rowCount: number;
  sampleRows?: Record<string, unknown>[];
}

export interface CellChange {
  rowIndex: number;
  columnName: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface QueryDiff {
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "CREATE" | "ALTER" | "DROP" | "TRANSACTION" | "OTHER";
  targetTable?: string;
  rowsAffected: number;
  insertedRows?: Record<string, unknown>[];
  deletedRows?: Record<string, unknown>[];
  modifiedCells?: CellChange[];
}

export interface QueryResult {
  columns: string[];
  values: (string | number | boolean | null)[][];
  rowsAffected: number;
  executionTimeMs: number;
  error?: string | null;
  diff?: QueryDiff | null;
  explanation?: string;
  databaseStateSummary?: Record<string, number>;
}
