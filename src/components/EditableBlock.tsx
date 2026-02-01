import React from "react";
import { ReportBlock } from "../types";
import { getTagForBlock, getBlockTextWithPrefix } from "../utils";

export const EditableBlock: React.FC<{
  block: ReportBlock;
  onUpdate: (id: string, newText: string) => void;
  onFocus: (id: string, element: HTMLElement) => void;
  listIndex?: number;
}> = ({ block, onUpdate, onFocus, listIndex }) => {
  const elRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elRef.current) {
      if (document.activeElement !== elRef.current) {
        const textFromProp = getBlockTextWithPrefix(block, listIndex);
        if (elRef.current.innerHTML !== textFromProp) {
          elRef.current.innerHTML = textFromProp;
        }
      }
    }
  }, [block]);

  const handleFocus = () => {
    onFocus(block.id, elRef.current!);
  };

  const handleBlur = () => {
    if (elRef.current) {
      const textFromDOM = elRef.current.innerText;
      const textFromProp = getBlockTextWithPrefix(block, listIndex);

      if (textFromDOM !== textFromProp) {
        onUpdate(block.id, textFromDOM);
      }
    }
  };

  const Tag = getTagForBlock(block.type);

  return (
    <div className="editable-block-wrapper">
      {block.type === "image" ? (
        <div className="report-block image-block">
          <img src={block.text} alt="Generated content" />
        </div>
      ) : (
        <Tag
          ref={elRef as any}
          contentEditable
          suppressContentEditableWarning
          className={`report-block type-${block.type}`}
          style={{
            fontSize: block.style.fontSize,
            fontFamily: block.style.fontFamily,
            color: block.style.color,
            fontWeight: block.style.bold ? "bold" : "normal",
            textAlign: block.type === "heading1" ? "center" : undefined,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-page-break={block.pageBreakBefore}
        />
      )}
    </div>
  );
};
