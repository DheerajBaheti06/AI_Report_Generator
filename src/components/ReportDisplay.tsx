import React from "react";
import { ReportBlock, FormattingOptions, BlockStyle } from "../types";
import { FloatingToolbar } from "./FloatingToolbar";
import { EditableBlock } from "./EditableBlock";

export const ReportDisplay: React.FC<{
  paginatedReport: ReportBlock[][];
  formattingOptions: FormattingOptions;
  zoomLevel: number;
  toolbarRef: React.RefObject<HTMLDivElement>;
  selectedElement: HTMLElement | null;
  selectedBlock: ReportBlock | null;
  handleBlockUpdate: (id: string, newText: string) => void;
  setSelectedBlockId: (id: string | null) => void;
  setSelectedElement: (el: HTMLElement | null) => void;
  handleStyleChange: (blockId: string, style: Partial<BlockStyle>) => void;
  handleApplyStyleToAll: (block: ReportBlock) => void;
  handlePageBreakToggle: (blockId: string) => void;
}> = ({
  paginatedReport,
  formattingOptions,
  zoomLevel,
  toolbarRef,
  selectedElement,
  selectedBlock,
  handleBlockUpdate,
  setSelectedBlockId,
  setSelectedElement,
  handleStyleChange,
  handleApplyStyleToAll,
  handlePageBreakToggle,
}) => {
  return (
    <div className="pages-container-wrapper">
      <FloatingToolbar
        ref={toolbarRef}
        targetElement={selectedElement}
        block={selectedBlock}
        onStyleChange={(blockId, style) => {
          // CRITICAL FIX: Sync text from DOM before applying style via atomic update
          let textToSync: string | undefined = undefined;
          if (selectedElement && selectedBlock?.id === blockId) {
            const currentText = selectedElement.innerText;
            // Only sync if different
            if (currentText !== selectedBlock?.text) {
              textToSync = currentText;
            }
          }
          handleStyleChange(blockId, style, textToSync);
        }}
        onApplyStyleToAll={handleApplyStyleToAll}
        onPageBreakToggle={handlePageBreakToggle}
      />
      <div
        className="pages-container"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top left",
        }}
      >
        {paginatedReport.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className={`output-page ${
              formattingOptions.showBorders ? "has-border" : ""
            }`}
            data-document-theme={formattingOptions.theme}
            style={
              {
                paddingLeft: formattingOptions.margin,
                paddingRight: formattingOptions.margin,
                "--page-margin": formattingOptions.margin,
              } as React.CSSProperties
            }
          >
            <div
              className="page-header-preview"
              style={{
                paddingLeft: formattingOptions.margin,
                paddingRight: formattingOptions.margin,
              }}
            >
              {formattingOptions.header}
            </div>
            <div
              className="report-display"
              style={{
                textAlign: formattingOptions.textAlign as any,
                lineHeight: formattingOptions.lineSpacing,
                fontFamily: formattingOptions.fontFamily,
                fontSize: formattingOptions.fontSize,
              }}
            >
              {page.map((block, blockIndex) => {
                return (
                  <EditableBlock
                    key={block.id}
                    block={block}
                    listIndex={(() => {
                      if (block.type !== "numbered") return undefined;
                      let count = 1;
                      // Backtrack in current page
                      for (let i = blockIndex - 1; i >= 0; i--) {
                        if (page[i].type === "numbered") count++;
                        else break;
                      }
                      return count;
                    })()}
                    onUpdate={handleBlockUpdate}
                    onFocus={(id, el) => {
                      setSelectedBlockId(id);
                      setSelectedElement(el);
                    }}
                  />
                );
              })}
            </div>
            <div
              className="page-footer-preview"
              style={{
                paddingLeft: formattingOptions.margin,
                paddingRight: formattingOptions.margin,
              }}
            >
              <span>{formattingOptions.footer}</span>
              {formattingOptions.showPageNumbers && (
                <span>{pageIndex + 1}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
