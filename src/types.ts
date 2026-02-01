export interface BlockStyle {
  fontSize: string;
  fontFamily: string;
  color: string;
  bold: boolean;
}

export interface ReportBlock {
  id: string;
  type:
    | "heading1"
    | "heading2"
    | "heading3"
    | "paragraph"
    | "bullet"
    | "numbered"
    | "image";
  text: string;
  style: BlockStyle;
  pageBreakBefore?: boolean;
}

export interface FormattingOptions {
  fontSize: string;
  fontFamily: string;
  lineSpacing: string;
  textAlign: string;
  margin: string;
  theme: string;
  header: string;
  footer: string;
  showPageNumbers: boolean;
  showBorders: boolean;
}

export interface HistoryEntry {
  report: ReportBlock[];
  formatting: FormattingOptions;
}
