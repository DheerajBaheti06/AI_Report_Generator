import { ReportBlock } from "./types";

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const generateId = () =>
  `block_${Math.random().toString(36).substr(2, 9)}`;

export const getTagForBlock = (type: ReportBlock["type"]) => {
  if (type === "heading1") return "h1";
  if (type === "heading2") return "h2";
  if (type === "heading3") return "h3";
  if (type === "image") return "div";
  return "p";
};

export const getBlockTextWithPrefix = (
  block: ReportBlock,
  listIndex?: number,
) => {
  if (block.type === "bullet") return `• ${block.text}`;
  if (block.type === "numbered") return `${listIndex ?? 1}. ${block.text}`;
  return block.text;
};
