export type SourceKind = string;

export interface TimelineSource {
  name: string;
  kind: SourceKind;
  ref: string;
  url?: string;
  icon?: string;
  meta?: Record<string, unknown>;
}

export interface TimelineItem {
  id: number;
  icon?: string;
  header?: string;
  body?: string;
  note?: string;
  at?: string | Date;
  sources?: TimelineSource[];
  title?: string;
}
