/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may
 * obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPE DECLARATIONS ---

// --- TYPE DEFINITIONS ---
interface BlockStyle {
  fontSize: string;
  fontFamily: string;
  color: string;
  bold: boolean;
}

interface ReportBlock {
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

interface FormattingOptions {
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

interface HistoryEntry {
  report: ReportBlock[];
  formatting: FormattingOptions;
}

// --- ICON COMPONENTS ---
const IconRefresh = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);
const IconUndo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
  </svg>
);
const IconRedo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.96 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
  </svg>
);
const IconFileDoc = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM13 9V3.5L18.5 9H13z" />
  </svg>
);
const IconFilePdf = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm-2.5.5h1v-1h-1v1zm7-1.5H14v6h1.5v-2h1.1c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5zm.9 2.5h-1v-1h1v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2-H4V6z" />
  </svg>
);
const IconTypography = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"></path>
  </svg>
);
const IconPageSetup = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6zm0 2h12v3H6V4zm0 5h12v11H6V9z"></path>
  </svg>
);
const IconHeaderFooter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M4 20h16v2H4v-2zM4 2h16v2H4V2zm11 5H9v11h6V7zm-2 9h-2V9h2v7z"></path>
  </svg>
);
const IconExport = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path>
  </svg>
);
const IconZoomIn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
  </svg>
);
const IconPageBreak = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 9h-3V5h-2v4H8l4 4 4-4zM4 18h16v-2H4v2zm0-7h16v-2H4v2z" />
  </svg>
);
const IconZoomOut: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 13H5v-2h14v2z"></path>
  </svg>
);
const IconAlignLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"></path>
  </svg>
);
const IconAlignCenter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"></path>
  </svg>
);
const IconAlignRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"></path>
  </svg>
);
const IconAlignJustify = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-4h18V3H3v2z"></path>
  </svg>
);
const IconSun = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);
const IconMoon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);
const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"></path>
  </svg>
);
const IconLinkedIn = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-11.5 15h2.5V10h-2.5v8zm-1.25-9.25c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25S8.94 7.5 8.25 7.5 7 8.06 7 8.75zM17 18h-2.5v-4.5c0-1.07-.02-2.44-1.5-2.44s-1.73 1.16-1.73 2.37V18h-2.5V10h2.4v1.1h.03c.34-.64 1.18-1.32 2.37-1.32 2.54 0 3 1.67 3 3.84V18z"></path>
  </svg>
);
const IconGitHub = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.1.73-.24.73-.53v-1.84c-3.03.66-3.67-1.46-3.67-1.46-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.56 1.2 3.18.92.1-.72.38-1.2.7-1.48-2.42-.28-4.96-1.2-4.96-5.38 0-1.19.42-2.16 1.13-2.92-.1-.28-.49-1.38.1-2.88 0 0 .92-.3 3 1.12a10.4 10.4 0 015.4 0c2.08-1.42 3-1.12 3-1.12.6 1.5.2 2.6.1 2.88.7.76 1.13 1.73 1.13 2.92 0 4.2-2.55 5.1-4.98 5.38.4.34.73.98.73 1.98v2.92c0 .3.18.63.73.53A11 11 0 0012 1.27z"></path>
  </svg>
);
const IconCopy = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
  </svg>
);
const IconExternalLink = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
  </svg>
);

// --- BASE64 HELPER FUNCTION ---
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// --- HELPER FUNCTIONS ---
const generateId = () => `block_${Math.random().toString(36).substr(2, 9)}`;
const getTagForBlock = (type: ReportBlock["type"]) => {
  if (type === "heading1") return "h1";
  if (type === "heading2") return "h2";
  if (type === "heading3") return "h3";
  if (type === "image") return "div";
  return "p";
};
const getBlockTextWithPrefix = (block: ReportBlock) => {
  if (block.type === "bullet") return `• ${block.text}`;
  if (block.type === "numbered") return `1. ${block.text}`; // Simplified for display
  return block.text;
};

// --- UI COMPONENTS ---
const IconButton = React.forwardRef<
  HTMLButtonElement,
  {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset";
  }
>(
  (
    { onClick, disabled, title, children, className = "", type = "button" },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={`icon-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  )
);

interface FloatingToolbarProps {
  targetElement: HTMLElement | null;
  block: ReportBlock | null;
  onStyleChange: (blockId: string, style: Partial<BlockStyle>) => void;
  onApplyStyleToAll: (block: ReportBlock) => void;
  onPageBreakToggle: (blockId: string) => void;
}

const FloatingToolbar = React.forwardRef<HTMLDivElement, FloatingToolbarProps>(
  (
    {
      targetElement,
      block,
      onStyleChange,
      onApplyStyleToAll,
      onPageBreakToggle,
    },
    ref
  ) => {
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const [isVisible, setIsVisible] = React.useState(false);
    const [isFaded, setIsFaded] = React.useState(false);
    const hideTimerRef = React.useRef<number | null>(null);

    const cancelHideTimer = React.useCallback(() => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }, []);

    const startHideTimer = React.useCallback(() => {
      cancelHideTimer();
      hideTimerRef.current = window.setTimeout(() => {
        setIsFaded(true);
      }, 3000);
    }, [cancelHideTimer]);

    React.useLayoutEffect(() => {
      const toolbarEl = (ref as React.RefObject<HTMLDivElement>).current;
      const container = targetElement?.closest(".preview-canvas");

      const updatePosition = () => {
        if (
          !targetElement ||
          !toolbarEl ||
          !container ||
          !document.contains(targetElement)
        ) {
          setIsVisible(false);
          cancelHideTimer();
          return;
        }

        const targetRect = targetElement.getBoundingClientRect();
        if (
          !targetRect ||
          (targetRect.width === 0 && targetRect.height === 0)
        ) {
          setIsVisible(false);
          cancelHideTimer();
          return;
        }

        setIsVisible(true);
        setIsFaded(false);
        startHideTimer();

        const containerRect = container.getBoundingClientRect();
        const { scrollTop, scrollLeft, clientWidth, clientHeight } = container;
        const { offsetWidth: toolbarWidth, offsetHeight: toolbarHeight } =
          toolbarEl;
        const margin = 18;

        const idealLeft =
          targetRect.left -
          containerRect.left +
          scrollLeft +
          targetRect.width / 2 -
          toolbarWidth / 2;

        let idealTop;
        const spaceAboveInViewport = targetRect.top - containerRect.top;

        // Prefer to place the toolbar above if there is enough space in the visible canvas area.
        if (spaceAboveInViewport >= toolbarHeight + margin) {
          idealTop =
            targetRect.top -
            containerRect.top +
            scrollTop -
            toolbarHeight -
            margin;
        } else {
          // Otherwise, place it below.
          idealTop = targetRect.bottom - containerRect.top + scrollTop + margin;
        }

        // Clamp position to ensure it stays within the visible canvas area
        const finalLeft = Math.max(
          scrollLeft + 5,
          Math.min(idealLeft, scrollLeft + clientWidth - toolbarWidth - 5)
        );

        const finalTop = Math.max(
          scrollTop + 5,
          Math.min(idealTop, scrollTop + clientHeight - toolbarHeight - 5)
        );

        setPosition({ top: finalTop, left: finalLeft });
      };

      updatePosition();

      document.addEventListener("selectionchange", updatePosition);
      container?.addEventListener("scroll", updatePosition, { passive: true });
      window.addEventListener("resize", updatePosition);

      return () => {
        document.removeEventListener("selectionchange", updatePosition);
        container?.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
        cancelHideTimer();
      };
    }, [targetElement, ref, startHideTimer, cancelHideTimer]);

    const isTextBasedBlock = block?.type !== "image";

    return (
      <div
        ref={ref}
        className={`floating-toolbar ${isFaded ? "faded" : ""}`}
        style={{
          top: position.top,
          left: position.left,
          visibility: isVisible ? "visible" : "hidden",
          opacity: isVisible && !isFaded ? 1 : 0,
        }}
        onMouseDown={(e) => e.preventDefault()}
        onMouseEnter={cancelHideTimer}
        onMouseLeave={startHideTimer}
      >
        {block && (
          <>
            {isTextBasedBlock && (
              <>
                <input
                  type="color"
                  value={block.style.color}
                  onChange={(e) =>
                    onStyleChange(block.id, { color: e.target.value })
                  }
                  title="Text Color"
                />
                <button
                  className={block.style.bold ? "active" : ""}
                  onClick={() =>
                    onStyleChange(block.id, { bold: !block.style.bold })
                  }
                  title="Bold"
                >
                  <b>B</b>
                </button>
                <button
                  onClick={() =>
                    onStyleChange(block.id, {
                      fontSize: `${parseInt(block.style.fontSize) - 1}px`,
                    })
                  }
                  title="Decrease font size"
                >
                  -
                </button>
                <span>{block.style.fontSize}</span>
                <button
                  onClick={() =>
                    onStyleChange(block.id, {
                      fontSize: `${parseInt(block.style.fontSize) + 1}px`,
                    })
                  }
                  title="Increase font size"
                >
                  +
                </button>
              </>
            )}
            <button
              className={`page-break-btn ${
                block.pageBreakBefore ? "active" : ""
              }`}
              onClick={() => onPageBreakToggle(block.id)}
              title={
                block.pageBreakBefore
                  ? "Remove page break"
                  : "Insert page break before"
              }
            >
              <IconPageBreak />
            </button>
            {isTextBasedBlock && (
              <>
                <button
                  className="apply-all"
                  onClick={() => onApplyStyleToAll(block)}
                  title="Apply style to all similar elements"
                >
                  Apply to All
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  }
);

const EditableBlock: React.FC<{
  block: ReportBlock;
  onUpdate: (id: string, newText: string) => void;
  onFocus: (id: string, element: HTMLElement) => void;
}> = ({ block, onUpdate, onFocus }) => {
  const elRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (elRef.current) {
      if (document.activeElement !== elRef.current) {
        const textFromProp = getBlockTextWithPrefix(block);
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
      const textFromProp = getBlockTextWithPrefix(block);

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
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-page-break={block.pageBreakBefore}
        />
      )}
    </div>
  );
};

const MobilePanel: React.FC<{
  panel: "format" | "header" | "export" | null;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ panel, onClose, title, children }) => {
  if (!panel) return null;

  return (
    <div className="mobile-format-panel-overlay" onClick={onClose}>
      <div
        className={`mobile-format-panel ${panel ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-panel-header">
          <h3>{title}</h3>
          <button className="close-panel-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="mobile-panel-content">{children}</div>
      </div>
    </div>
  );
};

const PAGE_WIDTH_IN = 8.5;
const PAGE_HEIGHT_IN = 11;
const DPI = 96; // Standard screen DPI assumption

const ReportDisplay: React.FC<{
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
        onStyleChange={handleStyleChange}
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
              {page.map((block) => (
                <EditableBlock
                  key={block.id}
                  block={block}
                  onUpdate={handleBlockUpdate}
                  onFocus={(id, el) => {
                    setSelectedBlockId(id);
                    setSelectedElement(el);
                  }}
                />
              ))}
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

// --- MODAL & POPOVER COMPONENTS ---
const ContactPopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}> = ({ isOpen, onClose, anchorRef }) => {
  const [copiedLink, setCopiedLink] = React.useState<
    "linkedin" | "github" | null
  >(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const handleCopy = (link: string, type: "linkedin" | "github") => {
    navigator.clipboard.writeText(link);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  React.useLayoutEffect(() => {
    if (isOpen && anchorRef.current && popoverRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popoverEl = popoverRef.current;

      popoverEl.style.position = "fixed";
      popoverEl.style.top = `${anchorRect.bottom + 8}px`;

      const popoverWidth = popoverEl.offsetWidth;
      const leftPosition =
        anchorRect.left + anchorRect.width / 2 - popoverWidth / 2;

      const clampedLeft = Math.max(
        16,
        Math.min(leftPosition, window.innerWidth - popoverWidth - 16)
      );

      popoverEl.style.left = `${clampedLeft}px`;
      popoverEl.style.right = "auto";
    }
  }, [isOpen, anchorRef]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !anchorRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const GITHUB_LINK = "https://github.com/DheerajBaheti06";
  const LINKEDIN_LINK = "https://www.linkedin.com/in/dheeraj-baheti1";

  return (
    <div ref={popoverRef} className="contact-popover">
      <div className="popover-header">
        <h4>Contact & Profiles</h4>
      </div>
      <div className="popover-body">
        <div className="popover-link-row">
          <IconLinkedIn />
          <div className="popover-link-info">
            <span>LinkedIn</span>
            <a href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer">
              in/dheeraj-baheti1
            </a>
          </div>
          <div className="popover-actions">
            <IconButton
              onClick={() => handleCopy(LINKEDIN_LINK, "linkedin")}
              title="Copy Link"
            >
              {copiedLink === "linkedin" ? "✓" : <IconCopy />}
            </IconButton>
            <a href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer">
              <IconButton onClick={() => {}} title="View Profile">
                <IconExternalLink />
              </IconButton>
            </a>
          </div>
        </div>
        <div className="popover-link-row">
          <IconGitHub />
          <div className="popover-link-info">
            <span>GitHub</span>
            <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
              DheerajBaheti06
            </a>
          </div>
          <div className="popover-actions">
            <IconButton
              onClick={() => handleCopy(GITHUB_LINK, "github")}
              title="Copy Link"
            >
              {copiedLink === "github" ? "✓" : <IconCopy />}
            </IconButton>
            <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
              <IconButton onClick={() => {}} title="View Profile">
                <IconExternalLink />
              </IconButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const THEME_DEFAULT_COLORS = {
  default: "#1f2937",
  charcoal: "#e2e8f0",
  paper: "#4a4a4a",
};

// The API key is retrieved from environment variables.
const API_KEY = process.env.GEMINI_API_KEY;

const App = () => {
  const [reportTopic, setReportTopic] = React.useState("");
  const [numberOfPages, setNumberOfPages] = React.useState("3");
  const [reportBlocks, setReportBlocks] = React.useState<ReportBlock[]>([]);
  const [formattingOptions, setFormattingOptions] =
    React.useState<FormattingOptions>({
      fontSize: "16px",
      fontFamily: "Arial",
      lineSpacing: "1.5",
      textAlign: "left",
      margin: "1in",
      theme: "default",
      header: "",
      footer: "Page",
      showPageNumbers: true,
      showBorders: false,
    });
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [error, setError] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"generate" | "preview">(
    "generate"
  );
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(
    null
  );
  const [selectedElement, setSelectedElement] =
    React.useState<HTMLElement | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [isThinkingModeEnabled, setIsThinkingModeEnabled] =
    React.useState(false);
  const [mobilePanel, setMobilePanel] = React.useState<
    null | "format" | "header" | "export"
  >(null);
  const [paginatedReport, setPaginatedReport] = React.useState<ReportBlock[][]>(
    []
  );
  const [exportMessage, setExportMessage] = React.useState("");
  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth <= 900
  );
  const [theme, setTheme] = React.useState("light");
  const [isContactPopoverOpen, setIsContactPopoverOpen] = React.useState(false);

  // Auto-Fit State
  const [needsAutoFit, setNeedsAutoFit] = React.useState(false);
  const [autoFitMessage, setAutoFitMessage] = React.useState("");
  const [originalFormattingBeforeFit, setOriginalFormattingBeforeFit] =
    React.useState<FormattingOptions | null>(null);
  const [originalBlocksBeforeFit, setOriginalBlocksBeforeFit] = React.useState<
    ReportBlock[] | null
  >(null);

  // Refs
  const desktopPreviewRef = React.useRef<HTMLDivElement>(null);
  const mobilePreviewRef = React.useRef<HTMLDivElement>(null);
  const zoomLevelRef = React.useRef(zoomLevel);
  zoomLevelRef.current = zoomLevel;
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const contactButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth <= 900);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const ai = React.useMemo(() => {
    if (!API_KEY) {
      return null;
    }
    return new GoogleGenAI({ apiKey: API_KEY });
  }, []);

  React.useEffect(() => {
    if (!API_KEY) {
      const errorMessage =
        "GEMINI_API_KEY environment variable not set. Please follow the setup instructions in the README file to configure your API key.";
      setError(errorMessage);
      setStatus("error");
      setActiveTab("generate");
    }
  }, []);

  const selectedBlock = React.useMemo(() => {
    return reportBlocks.find((b) => b.id === selectedBlockId) || null;
  }, [selectedBlockId, reportBlocks]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolbarRef.current && toolbarRef.current.contains(target)) {
        return;
      }
      if ((target as HTMLElement).closest(".editable-block-wrapper")) {
        return;
      }
      setSelectedBlockId(null);
      setSelectedElement(null);
    };

    if (selectedBlockId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedBlockId]);

  // --- DYNAMIC PAGINATION LOGIC ---
  React.useEffect(() => {
    const calculatePages = async () => {
      if (reportBlocks.length === 0) {
        setPaginatedReport([]);
        return;
      }

      const measurementContainer = document.createElement("div");
      document.body.appendChild(measurementContainer);
      Object.assign(measurementContainer.style, {
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: `calc(${PAGE_WIDTH_IN}in - ${formattingOptions.margin} - ${formattingOptions.margin})`,
      });

      const root = ReactDOM.createRoot(measurementContainer);

      root.render(
        <div
          className="report-display"
          style={{
            textAlign: formattingOptions.textAlign as any,
            lineHeight: formattingOptions.lineSpacing,
            fontFamily: formattingOptions.fontFamily,
            fontSize: formattingOptions.fontSize,
            padding: 0,
          }}
        >
          {reportBlocks.map((block) => (
            <EditableBlock
              key={block.id}
              block={block}
              onUpdate={() => {}}
              onFocus={() => {}}
            />
          ))}
        </div>
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const pages: ReportBlock[][] = [];
      let currentPage: ReportBlock[] = [];
      let currentHeight = 0;
      const PAGE_CONTENT_HEIGHT_PX = (PAGE_HEIGHT_IN - 2) * DPI;

      const measuredWrappers = Array.from(
        measurementContainer.querySelectorAll(".editable-block-wrapper")
      ) as HTMLElement[];

      reportBlocks.forEach((block, index) => {
        const element = measuredWrappers[index];
        if (!element) return;

        const elementHeight = element.offsetHeight;

        if (block.pageBreakBefore) {
          if (currentPage.length > 0) {
            pages.push(currentPage);
          }
          currentPage = [];
          currentHeight = 0;
        }

        if (elementHeight > PAGE_CONTENT_HEIGHT_PX) {
          if (currentPage.length > 0) {
            pages.push(currentPage);
          }
          pages.push([block]);
          currentPage = [];
          currentHeight = 0;
          return;
        }

        if (
          currentHeight + elementHeight > PAGE_CONTENT_HEIGHT_PX &&
          currentPage.length > 0
        ) {
          pages.push(currentPage);
          currentPage = [block];
          currentHeight = elementHeight;
        } else {
          currentPage.push(block);
          currentHeight += elementHeight;
        }
      });

      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      setPaginatedReport(pages);

      root.unmount();
      document.body.removeChild(measurementContainer);
    };

    const debounceTimer = setTimeout(calculatePages, 200);
    return () => clearTimeout(debounceTimer);
  }, [reportBlocks, formattingOptions]);

  const updateHistory = React.useCallback(
    (newReport: ReportBlock[], newFormatting: FormattingOptions) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ report: newReport, formatting: newFormatting });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  // --- AUTO-FIT LOGIC ---
  React.useEffect(() => {
    if (!needsAutoFit || paginatedReport.length === 0 || status !== "success") {
      return;
    }

    const targetPageCount = parseInt(numberOfPages);
    const currentPageCount = paginatedReport.length;

    if (currentPageCount > targetPageCount) {
      const currentGlobalFontSize = parseInt(formattingOptions.fontSize);

      if (currentGlobalFontSize <= 10) {
        setNeedsAutoFit(false);
        setAutoFitMessage(
          `Content is too long to fit into ${targetPageCount} pages. We've made it as compact as possible.`
        );
        updateHistory(reportBlocks, formattingOptions);
        return;
      }

      const newFontSize = `${currentGlobalFontSize - 1}px`;
      const newReportBlocks = reportBlocks.map((b) => {
        if (b.type === "image") return b;
        const currentBlockFontSize = parseInt(b.style.fontSize);
        if (isNaN(currentBlockFontSize)) return b;
        return {
          ...b,
          style: { ...b.style, fontSize: `${currentBlockFontSize - 1}px` },
        };
      });

      setReportBlocks(newReportBlocks);
      setFormattingOptions((prev) => ({ ...prev, fontSize: newFontSize }));
    } else {
      setNeedsAutoFit(false);
      if (
        originalFormattingBeforeFit &&
        originalFormattingBeforeFit.fontSize !== formattingOptions.fontSize
      ) {
        setAutoFitMessage(
          `✨ Auto-Fit Applied: Your report has been formatted to fit ${targetPageCount} pages.`
        );
      }
      updateHistory(reportBlocks, formattingOptions);
    }
  }, [
    paginatedReport,
    needsAutoFit,
    formattingOptions,
    numberOfPages,
    status,
    reportBlocks,
    originalFormattingBeforeFit,
    updateHistory,
  ]);

  const handleRevertAutoFit = () => {
    if (originalFormattingBeforeFit && originalBlocksBeforeFit) {
      setFormattingOptions(originalFormattingBeforeFit);
      setReportBlocks(originalBlocksBeforeFit);
      updateHistory(originalBlocksBeforeFit, originalFormattingBeforeFit);
    }
    setAutoFitMessage("");
    setOriginalFormattingBeforeFit(null);
    setOriginalBlocksBeforeFit(null);
  };

  const adjustZoomToFit = React.useCallback(() => {
    if (isMobileView) {
      setZoomLevel(30);
      const previewContainer = mobilePreviewRef.current;
      if (previewContainer) {
        const pageContainer = previewContainer.querySelector(
          ".pages-container-wrapper"
        );
        if (pageContainer) {
          const containerWidth = previewContainer.clientWidth;
          const contentWidth = pageContainer.clientWidth;
          const scaledContentWidth = contentWidth * 0.3;
          previewContainer.scrollLeft =
            (scaledContentWidth - containerWidth) / 2;
          previewContainer.scrollTop = 0;
        }
      }
      return;
    }

    const previewContainer = desktopPreviewRef.current;
    const pageContainer = previewContainer?.querySelector(
      ".pages-container-wrapper"
    );

    if (previewContainer && pageContainer) {
      const containerWidth = previewContainer.clientWidth;
      const containerHeight = previewContainer.clientHeight;
      const contentWidth = pageContainer.clientWidth;
      const contentHeight = pageContainer.clientHeight;

      const PADDING_PX = 40;

      if (contentWidth > 0 && contentHeight > 0) {
        const widthRatio = (containerWidth - PADDING_PX) / contentWidth;
        const heightRatio = (containerHeight - PADDING_PX) / contentHeight;

        const idealZoom = Math.min(widthRatio, heightRatio) * 100;
        const newZoom = Math.max(10, Math.floor(idealZoom));

        setZoomLevel(newZoom);
        const scaledContentWidth = contentWidth * (newZoom / 100);
        const scaledContentHeight = contentHeight * (newZoom / 100);
        previewContainer.scrollLeft = (scaledContentWidth - containerWidth) / 2;
        previewContainer.scrollTop =
          (scaledContentHeight - containerHeight) / 2;
      }
    }
  }, [isMobileView]);

  React.useEffect(() => {
    if (activeTab === "preview") {
      const timer = setTimeout(adjustZoomToFit, 100);
      window.addEventListener("resize", adjustZoomToFit);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", adjustZoomToFit);
      };
    }
  }, [activeTab, adjustZoomToFit]);

  // Unified canvas interaction logic (pan, zoom, scroll)
  React.useEffect(() => {
    const canvas = isMobileView
      ? mobilePreviewRef.current
      : desktopPreviewRef.current;
    if (!canvas || activeTab !== "preview") return;

    const isPanning = { current: false };
    const panStart = { x: 0, y: 0 };
    const scrollStart = { top: 0, left: 0 };

    const handleZoom = (delta: number, clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const oldZoom = zoomLevelRef.current;
      const newZoom = Math.round(Math.max(10, Math.min(oldZoom + delta, 300)));

      const contentX = (mouseX + canvas.scrollLeft) / (oldZoom / 100);
      const contentY = (mouseY + canvas.scrollTop) / (oldZoom / 100);

      const newScrollLeft = contentX * (newZoom / 100) - mouseX;
      const newScrollTop = contentY * (newZoom / 100) - mouseY;

      setZoomLevel(newZoom);
      requestAnimationFrame(() => {
        canvas.scrollLeft = newScrollLeft;
        canvas.scrollTop = newScrollTop;
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        handleZoom(e.deltaY * -0.1, e.clientX, e.clientY);
      } else {
        canvas.scrollTop += e.deltaY;
        canvas.scrollLeft += e.deltaX;
      }
    };

    const handlePanStart = (
      clientX: number,
      clientY: number,
      target: EventTarget | null
    ) => {
      if ((target as HTMLElement)?.closest("[contenteditable]")) {
        return;
      }
      isPanning.current = true;
      panStart.x = clientX;
      panStart.y = clientY;
      scrollStart.left = canvas.scrollLeft;
      scrollStart.top = canvas.scrollTop;
      canvas.classList.add("is-panning");
    };

    const handlePanMove = (clientX: number, clientY: number) => {
      if (!isPanning.current) return;
      const dx = clientX - panStart.x;
      const dy = clientY - panStart.y;
      canvas.scrollLeft = scrollStart.left - dx;
      canvas.scrollTop = scrollStart.top - dy;
    };

    const handlePanEnd = () => {
      isPanning.current = false;
      canvas.classList.remove("is-panning");
    };

    const onMouseDown = (e: MouseEvent) =>
      handlePanStart(e.clientX, e.clientY, e.target);
    const onMouseMove = (e: MouseEvent) => handlePanMove(e.clientX, e.clientY);

    let initialDistance: number | null = null;
    let initialZoom: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handlePanStart(touch.clientX, touch.clientY, e.target);
      } else if (e.touches.length === 2) {
        e.preventDefault();
        isPanning.current = false;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        initialZoom = zoomLevelRef.current;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isPanning.current) {
        e.preventDefault();
        const touch = e.touches[0];
        handlePanMove(touch.clientX, touch.clientY);
      } else if (
        e.touches.length === 2 &&
        initialDistance !== null &&
        initialZoom !== null
      ) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const newDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        const scale = newDistance / initialDistance;

        const newZoomAttempt = initialZoom * scale;
        const delta = newZoomAttempt - zoomLevelRef.current;

        const midX = (touch1.clientX + touch2.clientX) / 2;
        const midY = (touch1.clientY + touch2.clientY) / 2;

        handleZoom(delta, midX, midY);
      }
    };

    const onTouchEnd = () => {
      handlePanEnd();
      initialDistance = null;
      initialZoom = null;
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", handlePanEnd);

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("touchcancel", onTouchEnd);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", handlePanEnd);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [activeTab, isMobileView, status]);

  // --- HISTORY MANAGEMENT ---
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setReportBlocks(history[newIndex].report);
      setFormattingOptions(history[newIndex].formatting);
    }
  };
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setReportBlocks(history[newIndex].report);
      setFormattingOptions(history[newIndex].formatting);
    }
  };

  // --- REPORT GENERATION ---
  const handleGenerateReport = async () => {
    if (!ai) {
      setError(
        "Cannot generate report: AI service is not initialized. Check your GEMINI_API_KEY configuration in your environment variables."
      );
      setStatus("error");
      return;
    }
    if (!reportTopic) {
      setError("Please enter a topic for the report.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setActiveTab("preview");
    setError("");
    setAutoFitMessage("");

    const pageCount = parseInt(numberOfPages) || 1;
    const wordCount = pageCount * 450;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        report: {
          type: Type.ARRAY,
          description: "An array of content blocks that make up the report.",
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                description: "The type of content block.",
                enum: [
                  "heading1",
                  "heading2",
                  "heading3",
                  "paragraph",
                  "bullet",
                  "numbered",
                ],
              },
              text: {
                type: Type.STRING,
                description: "The text content for the block.",
              },
            },
            required: ["type", "text"],
          },
        },
      },
      required: ["report"],
    };

    const systemInstruction = `You are a professional report writer AI. Your most important duty is to strictly adhere to the user's specified length and word count constraints. Producing a report of the correct length is more important than including every possible detail. You must be concise.`;

    const prompt = `Generate a report on the topic: "${reportTopic}".

**ABSOLUTE MANDATORY REQUIREMENT: LENGTH**

-   **MAXIMUM WORD COUNT: ${wordCount} words.**
-   This is a **HARD LIMIT**. You **MUST NOT** exceed this word count under any circumstances.
-   The final output should be suitable for a document of approximately **${pageCount} pages**.
-   To achieve this, you MUST be concise, summarize information effectively, and omit filler content. Focus only on the most critical points.
-   **If you generate a report that is significantly longer than ${wordCount} words, you have failed the task.**

**Output Format Instructions:**
- You MUST respond with a single, valid JSON object that strictly adheres to the provided schema.
- The JSON object must be structured as: { "report": [ { "type": "...", "text": "..." } ] }.
- Allowed "type" values are: "heading1", "heading2", "heading3", "paragraph", "bullet", "numbered".
- Do NOT include a main title at the very beginning (like a "heading1" with the report topic). Start directly with the first section heading.
- Do NOT output markdown, backticks, or any text outside of the JSON structure.

**FINAL REMINDER: The word count limit of ${wordCount} words is NOT a suggestion. It is a strict rule. Do not fail.**`;

    try {
      const modelName = isThinkingModeEnabled
        ? "gemini-2.5-pro"
        : "gemini-2.5-flash";
      const config: any = {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        seed: Math.floor(Math.random() * 1000000),
        temperature: 0.9,
      };
      if (isThinkingModeEnabled) {
        config.thinkingConfig = { thinkingBudget: 32768 };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config,
      });

      const parsedResponse = JSON.parse(response.text);

      if (!parsedResponse.report || !Array.isArray(parsedResponse.report)) {
        throw new Error("Invalid JSON structure received from API.");
      }

      const themeColor =
        THEME_DEFAULT_COLORS[
          formattingOptions.theme as keyof typeof THEME_DEFAULT_COLORS
        ] || THEME_DEFAULT_COLORS.default;
      const baseStyle = {
        fontSize: formattingOptions.fontSize,
        fontFamily: formattingOptions.fontFamily,
        color: themeColor,
        bold: false,
      };

      const newReport: ReportBlock[] = parsedResponse.report.map(
        (block: any) => {
          let style = { ...baseStyle };
          if (block.type === "heading1") {
            style = { ...style, fontSize: "32px", bold: true };
          } else if (block.type === "heading2") {
            style = { ...style, fontSize: "24px", bold: true };
          } else if (block.type === "heading3") {
            style = { ...style, fontSize: "20px", bold: true };
          }
          return {
            id: generateId(),
            type: block.type,
            text: block.text,
            style: style,
            pageBreakBefore: false,
          };
        }
      );

      setReportBlocks(newReport);
      setStatus("success");
      setOriginalFormattingBeforeFit(formattingOptions);
      setOriginalBlocksBeforeFit(newReport);
      setNeedsAutoFit(true);
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to generate the report. Please try again.";
      if (err instanceof SyntaxError) {
        errorMessage =
          "The AI returned an invalid format. Please try regenerating.";
      } else if (err instanceof Error && err.message.includes("Invalid JSON")) {
        errorMessage =
          "The AI returned an invalid format. Please try regenerating.";
      } else if (err instanceof Error) {
        errorMessage = `An error occurred: ${err.message}`;
      }
      setError(errorMessage);
      setStatus("error");
    }
  };

  // --- STYLING & EDITING ---
  const handleGlobalFormatChange = (
    option: keyof FormattingOptions,
    value: any
  ) => {
    setAutoFitMessage("");
    const oldFormatting = { ...formattingOptions };
    const newFormatting = { ...formattingOptions, [option]: value };
    setFormattingOptions(newFormatting);

    let reportToUpdate = [...reportBlocks];
    let reportChanged = false;

    if (option === "theme") {
      const oldDefaultColor =
        THEME_DEFAULT_COLORS[
          oldFormatting.theme as keyof typeof THEME_DEFAULT_COLORS
        ] || THEME_DEFAULT_COLORS.default;
      const newDefaultColor =
        THEME_DEFAULT_COLORS[value as keyof typeof THEME_DEFAULT_COLORS] ||
        THEME_DEFAULT_COLORS.default;

      if (oldDefaultColor.toLowerCase() !== newDefaultColor.toLowerCase()) {
        reportToUpdate = reportToUpdate.map((b) => {
          if (b.style.color.toLowerCase() === oldDefaultColor.toLowerCase()) {
            return {
              ...b,
              style: { ...b.style, color: newDefaultColor },
            };
          }
          return b;
        });
        reportChanged = true;
      }
    }

    if (option === "fontFamily" || option === "fontSize") {
      reportToUpdate = reportToUpdate.map((b) => {
        if (
          b.type === "paragraph" ||
          b.type === "bullet" ||
          b.type === "numbered"
        ) {
          return {
            ...b,
            style: {
              ...b.style,
              [option]: value,
            },
          };
        }
        return b;
      });
      reportChanged = true;
    }

    if (reportChanged) {
      setReportBlocks(reportToUpdate);
      updateHistory(reportToUpdate, newFormatting);
    } else {
      updateHistory(reportBlocks, newFormatting);
    }
  };

  const handleBlockUpdate = (id: string, newText: string) => {
    const newReport = reportBlocks.map((b) =>
      b.id === id ? { ...b, text: newText.replace(/^• |^\d+\. /, "") } : b
    );
    setReportBlocks(newReport);
    updateHistory(newReport, formattingOptions);
  };

  const handleStyleChange = (blockId: string, style: Partial<BlockStyle>) => {
    setAutoFitMessage("");
    const newReport = reportBlocks.map((b) => {
      if (b.id === blockId) {
        return { ...b, style: { ...b.style, ...style } };
      }
      return b;
    });
    setReportBlocks(newReport);
    updateHistory(newReport, formattingOptions);
  };

  const handleApplyStyleToAll = (block: ReportBlock) => {
    setAutoFitMessage("");
    const newReport = reportBlocks.map((b) => {
      if (b.type === block.type) {
        return { ...b, style: { ...block.style } };
      }
      return b;
    });
    setReportBlocks(newReport);
    updateHistory(newReport, formattingOptions);
  };

  const handlePageBreakToggle = (blockId: string) => {
    const newReport = reportBlocks.map((b) => {
      if (b.id === blockId) {
        return { ...b, pageBreakBefore: !b.pageBreakBefore };
      }
      return b;
    });
    setReportBlocks(newReport);
    updateHistory(newReport, formattingOptions);
  };

  // --- EXPORTING ---
  const handleExportRequest = (type: "pdf" | "docx") => {
    if (exportMessage) return;
    if (type === "pdf") {
      exportToPDF();
    } else if (type === "docx") {
      exportToDocx();
    }
  };

  const exportToPDF = async () => {
    setExportMessage("Exporting to PDF...");

    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [PAGE_WIDTH_IN, PAGE_HEIGHT_IN],
      });

      const allPageElements = Array.from(
        document.querySelectorAll(".output-page")
      ) as HTMLElement[];
      const visiblePageElements = allPageElements.filter(
        (el) => el.offsetParent !== null
      );

      if (visiblePageElements.length === 0) {
        throw new Error("No content pages are visible to export.");
      }

      for (let i = 0; i < visiblePageElements.length; i++) {
        const pageElement = visiblePageElements[i];

        const printContainer = document.createElement("div");
        document.body.appendChild(printContainer);
        Object.assign(printContainer.style, {
          position: "absolute",
          left: "-9999px",
          top: "0px",
          margin: "0",
          padding: "0",
        });

        const clonedPage = pageElement.cloneNode(true) as HTMLElement;
        printContainer.appendChild(clonedPage);

        await new Promise((resolve) => setTimeout(resolve, 50));

        try {
          const images = Array.from(clonedPage.querySelectorAll("img"));
          await Promise.all(
            images.map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            })
          );

          const canvas = await html2canvas(clonedPage, {
            scale: 2,
            useCORS: true,
            logging: false,
            width: clonedPage.offsetWidth,
            height: clonedPage.offsetHeight,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
          });

          const imgData = canvas.toDataURL("image/png");
          if (imgData === "data:,") {
            throw new Error(`Generated image for page ${i + 1} was empty.`);
          }

          if (i > 0) {
            doc.addPage();
          }

          doc.addImage(
            imgData,
            "PNG",
            0,
            0,
            PAGE_WIDTH_IN,
            PAGE_HEIGHT_IN,
            undefined,
            "FAST"
          );
        } finally {
          document.body.removeChild(printContainer);
        }
      }

      doc.save("report.pdf");
      setExportMessage("");
    } catch (err) {
      console.error("PDF Export failed:", err);
      let errorMessage = "PDF Export Failed.";
      if (err instanceof Error) {
        errorMessage = `PDF Export failed: ${err.message}`;
      }
      setExportMessage(errorMessage);
      setTimeout(() => setExportMessage(""), 5000);
    }
  };

  const exportToDocx = async () => {
    setExportMessage("Exporting to DOCX...");
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        AlignmentType,
        HeadingLevel,
        Header,
        Footer,
        PageNumber,
        ImageRun,
        BorderStyle,
        PageBorderDisplay,
      } = await import("docx");

      const getAlignment = (align: string) => {
        switch (align) {
          case "center":
            return AlignmentType.CENTER;
          case "right":
            return AlignmentType.RIGHT;
          case "justify":
            return AlignmentType.JUSTIFIED;
          default:
            return AlignmentType.LEFT;
        }
      };

      const getImageDimensions = (
        dataUrl: string
      ): Promise<{ width: number; height: number }> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = (err) => {
            reject(err);
          };
          img.src = dataUrl;
        });
      };

      const pointsToTwips = (points: number) => Math.round(points * 20);

      const childrenPromises = reportBlocks.map(async (block) => {
        if (block.type === "image") {
          try {
            const parts = block.text.split(",");
            if (parts.length < 2) return null;
            const base64Data = parts[1];

            const { width, height } = await getImageDimensions(block.text);
            const targetWidth = 600;
            const targetHeight = (height / width) * targetWidth;

            const imageOptions = {
              type: "png" as const,
              data: decode(base64Data),
              transformation: { width: targetWidth, height: targetHeight },
            };

            return new Paragraph({
              children: [new ImageRun(imageOptions)],
              alignment: AlignmentType.CENTER,
            });
          } catch (e) {
            console.error("Error processing image for DOCX:", e);
            return null;
          }
        } else {
          const textRunProperties = {
            font: block.style.fontFamily,
            size: Math.round(parseInt(block.style.fontSize) * (72 / 96) * 2),
            bold: block.style.bold,
            color: block.style.color.substring(1),
          };

          const paragraphConfig: any = {
            children: [new TextRun({ text: block.text, ...textRunProperties })],
            spacing: {
              line: Math.round(parseFloat(formattingOptions.lineSpacing) * 240),
            },
            alignment: getAlignment(formattingOptions.textAlign),
          };

          const fontSizeInPoints = parseInt(block.style.fontSize) * 0.75;
          switch (block.type) {
            case "heading1":
              paragraphConfig.spacing.before = pointsToTwips(
                fontSizeInPoints * 1.5
              );
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.4
              );
              break;
            case "heading2":
              paragraphConfig.spacing.before = pointsToTwips(
                fontSizeInPoints * 1.2
              );
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.4
              );
              break;
            case "heading3":
              paragraphConfig.spacing.before = pointsToTwips(
                fontSizeInPoints * 1.0
              );
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.4
              );
              break;
            case "paragraph":
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.5
              );
              break;
            case "bullet":
            case "numbered":
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.2
              );
              break;
          }

          if (block.type.startsWith("heading")) {
            paragraphConfig.heading =
              HeadingLevel[
                `HEADING_${block.type.slice(-1)}` as
                  | "HEADING_1"
                  | "HEADING_2"
                  | "HEADING_3"
              ];
          }
          if (block.type === "bullet") paragraphConfig.bullet = { level: 0 };
          if (block.type === "numbered")
            paragraphConfig.numbering = { reference: "my-numbering", level: 0 };
          if (block.pageBreakBefore) paragraphConfig.pageBreakBefore = true;

          return new Paragraph(paragraphConfig);
        }
      });

      const resolvedChildren = await Promise.all(childrenPromises);
      const children = resolvedChildren.filter(Boolean);

      const parseMargin = (marginStr: string): number => {
        const value = parseFloat(marginStr);
        if (isNaN(value)) return 1440;
        if (marginStr.includes("in")) return value * 1440;
        if (marginStr.includes("cm")) return value * 567;
        return value * 1440;
      };
      const marginSize = parseMargin(formattingOptions.margin);

      const sectionConfig: any = {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                text: formattingOptions.header,
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun(formattingOptions.footer + " "),
                  ...(formattingOptions.showPageNumbers
                    ? [new TextRun({ children: [PageNumber.CURRENT] })]
                    : []),
                ],
              }),
            ],
          }),
        },
        properties: {
          page: {
            margin: {
              top: marginSize,
              right: marginSize,
              bottom: marginSize,
              left: marginSize,
            },
          },
        },
        children: children as any[],
      };

      if (formattingOptions.showBorders) {
        sectionConfig.properties.page.pageBorders = {
          display: PageBorderDisplay.ALL_PAGES,
          top: { style: BorderStyle.DOUBLE, size: 24, color: "auto" },
          bottom: { style: BorderStyle.DOUBLE, size: 24, color: "auto" },
          left: { style: BorderStyle.DOUBLE, size: 24, color: "auto" },
          right: { style: BorderStyle.DOUBLE, size: 24, color: "auto" },
        };
      }

      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "my-numbering",
              levels: [
                {
                  level: 0,
                  format: "decimal",
                  text: "%1.",
                  alignment: AlignmentType.START,
                },
              ],
            },
          ],
        },
        sections: [sectionConfig],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportMessage("");
    } catch (err) {
      console.error("DOCX Export failed:", err);
      setExportMessage("DOCX Export Failed.");
      setTimeout(() => setExportMessage(""), 3000);
    }
  };

  // --- THEME ---
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // --- RENDER HELPERS for PREVIEW TAB ---
  const formattingPanelContent = (
    <>
      <div className="input-group">
        <label htmlFor="font-family">Font Family</label>
        <select
          id="font-family"
          value={formattingOptions.fontFamily}
          onChange={(e) =>
            handleGlobalFormatChange("fontFamily", e.target.value)
          }
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>
      <div className="inline-inputs">
        <div className="input-group">
          <label htmlFor="font-size">Font Size</label>
          <input
            type="text"
            id="font-size"
            value={formattingOptions.fontSize}
            onChange={(e) =>
              handleGlobalFormatChange("fontSize", e.target.value)
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="line-spacing">Line Spacing</label>
          <select
            id="line-spacing"
            value={formattingOptions.lineSpacing}
            onChange={(e) =>
              handleGlobalFormatChange("lineSpacing", e.target.value)
            }
          >
            <option value="1">Single</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2">Double</option>
          </select>
        </div>
      </div>
      <div className="input-group">
        <label>Text Align</label>
        <div className="action-group button-group">
          <IconButton
            className={formattingOptions.textAlign === "left" ? "active" : ""}
            onClick={() => handleGlobalFormatChange("textAlign", "left")}
            title="Align Left"
          >
            <IconAlignLeft />
          </IconButton>
          <IconButton
            className={formattingOptions.textAlign === "center" ? "active" : ""}
            onClick={() => handleGlobalFormatChange("textAlign", "center")}
            title="Align Center"
          >
            <IconAlignCenter />
          </IconButton>
          <IconButton
            className={formattingOptions.textAlign === "right" ? "active" : ""}
            onClick={() => handleGlobalFormatChange("textAlign", "right")}
            title="Align Right"
          >
            <IconAlignRight />
          </IconButton>
          <IconButton
            className={
              formattingOptions.textAlign === "justify" ? "active" : ""
            }
            onClick={() => handleGlobalFormatChange("textAlign", "justify")}
            title="Align Justify"
          >
            <IconAlignJustify />
          </IconButton>
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="doc-theme">Document Theme</label>
        <select
          id="doc-theme"
          value={formattingOptions.theme}
          onChange={(e) => handleGlobalFormatChange("theme", e.target.value)}
        >
          <option value="default">Default</option>
          <option value="charcoal">Charcoal</option>
          <option value="paper">Paper</option>
        </select>
      </div>
      <div className="input-group-inline checkbox-group">
        <input
          id="show-borders"
          type="checkbox"
          checked={formattingOptions.showBorders}
          onChange={(e) =>
            handleGlobalFormatChange("showBorders", e.target.checked)
          }
        />
        <label htmlFor="show-borders">Show Page Borders</label>
      </div>
    </>
  );

  const headerFooterPanelContent = (
    <div className="sidebar-section-content">
      <div className="input-group">
        <label htmlFor="header-text">Header Text</label>
        <input
          type="text"
          id="header-text"
          value={formattingOptions.header}
          onChange={(e) => handleGlobalFormatChange("header", e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="footer-text">Footer Text</label>
        <input
          type="text"
          id="footer-text"
          value={formattingOptions.footer}
          onChange={(e) => handleGlobalFormatChange("footer", e.target.value)}
        />
      </div>
      <div className="input-group-inline checkbox-group">
        <input
          id="show-page-numbers"
          type="checkbox"
          checked={formattingOptions.showPageNumbers}
          onChange={(e) =>
            handleGlobalFormatChange("showPageNumbers", e.target.checked)
          }
        />
        <label htmlFor="show-page-numbers">Show Page Numbers</label>
      </div>
    </div>
  );

  const exportPanelContent = (
    <div className="sidebar-section-content">
      <button
        className="action-button export-button-panel"
        onClick={() => handleExportRequest("docx")}
        disabled={!!exportMessage}
      >
        <IconFileDoc /> <span>Export to DOCX</span>
      </button>
      <button
        className="action-button export-button-panel"
        onClick={() => handleExportRequest("pdf")}
        disabled={!!exportMessage}
      >
        <IconFilePdf /> <span>Export to PDF</span>
      </button>
      {exportMessage && (
        <div
          className={`status-message small ${
            exportMessage.toLowerCase().includes("failed") ? "error" : ""
          }`}
        >
          {exportMessage}
        </div>
      )}
    </div>
  );

  const renderPreview = () => {
    if (status === "loading") {
      return (
        <div className="status-message">
          <div className="loader"></div>
          <p>Generating your report...</p>
        </div>
      );
    }
    if (status === "error" && reportBlocks.length === 0) {
      return (
        <div className="status-message">
          <p className="error-message">{error}</p>
        </div>
      );
    }
    if (reportBlocks.length === 0) {
      return (
        <div className="status-message">
          <p>Generate a report to see a preview here.</p>
        </div>
      );
    }

    const reportDisplayProps = {
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
    };

    const handleZoomButtonClick = (amount: number) => {
      const canvas = isMobileView
        ? mobilePreviewRef.current
        : desktopPreviewRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const midY = rect.top + rect.height / 2;

      const oldZoom = zoomLevel;
      const newZoom = Math.round(Math.max(10, Math.min(oldZoom + amount, 300)));

      const contentX = (midX - rect.left + canvas.scrollLeft) / (oldZoom / 100);
      const contentY = (midY - rect.top + canvas.scrollTop) / (oldZoom / 100);

      const newScrollLeft = contentX * (newZoom / 100) - (midX - rect.left);
      const newScrollTop = contentY * (newZoom / 100) - (midY - rect.top);

      setZoomLevel(newZoom);
      requestAnimationFrame(() => {
        canvas.scrollLeft = newScrollLeft;
        canvas.scrollTop = newScrollTop;
      });
    };

    return (
      <div className="preview-card">
        <div className="desktop-layout">
          <div className="preview-sidebar">
            <details open className="sidebar-section">
              <summary>Typography</summary>
              <div className="sidebar-section-content">
                {formattingPanelContent}
              </div>
            </details>
            <details className="sidebar-section">
              <summary>Header & Footer</summary>
              {headerFooterPanelContent}
            </details>
          </div>
          <div className="preview-main-area">
            {autoFitMessage && (
              <div className="autofit-notification">
                <span>{autoFitMessage}</span>
                {originalFormattingBeforeFit && (
                  <button onClick={handleRevertAutoFit}>Revert</button>
                )}
              </div>
            )}
            <div className="preview-top-bar">
              <div className="top-bar-group">
                <h4>{reportTopic || "Untitled Report"}</h4>
              </div>
              <div className="top-bar-group">
                <IconButton
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  title="Undo"
                >
                  <IconUndo />
                </IconButton>
                <IconButton
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo"
                >
                  <IconRedo />
                </IconButton>
              </div>
              <div className="top-bar-group">
                <div className="zoom-controls">
                  <IconButton
                    onClick={() => handleZoomButtonClick(-10)}
                    title="Zoom Out"
                  >
                    <IconZoomOut />
                  </IconButton>
                  <div
                    className="zoom-display"
                    onClick={adjustZoomToFit}
                    title="Fit to screen"
                  >
                    {zoomLevel}%
                  </div>
                  <IconButton
                    onClick={() => handleZoomButtonClick(10)}
                    title="Zoom In"
                  >
                    <IconZoomIn />
                  </IconButton>
                </div>
              </div>
              <div className="top-bar-group">
                <IconButton
                  onClick={() => handleExportRequest("docx")}
                  disabled={!!exportMessage}
                  title="Export to DOCX"
                >
                  <IconFileDoc />
                </IconButton>
                <IconButton
                  onClick={() => handleExportRequest("pdf")}
                  disabled={!!exportMessage}
                  title="Export to PDF"
                >
                  <IconFilePdf />
                </IconButton>
                {exportMessage && (
                  <span
                    className={`export-status-message ${
                      exportMessage.toLowerCase().includes("failed")
                        ? "error"
                        : ""
                    }`}
                  >
                    {exportMessage}
                  </span>
                )}
              </div>
              <div className="top-bar-group">
                <IconButton
                  onClick={() => {
                    setStatus("idle");
                    setActiveTab("generate");
                  }}
                  title="Regenerate Report"
                >
                  <IconRefresh />
                </IconButton>
              </div>
            </div>
            <div ref={desktopPreviewRef} className="preview-canvas">
              <ReportDisplay {...reportDisplayProps} />
            </div>
          </div>
        </div>
        <div className="mobile-layout">
          {autoFitMessage && (
            <div className="autofit-notification mobile">
              <span>{autoFitMessage}</span>
              {originalFormattingBeforeFit && (
                <button onClick={handleRevertAutoFit}>Revert</button>
              )}
            </div>
          )}
          <div className="mobile-preview-header">
            <h4>{reportTopic || "Untitled Report"}</h4>
            <div className="action-group">
              <div className="zoom-controls">
                <IconButton
                  onClick={() => handleZoomButtonClick(-10)}
                  title="Zoom Out"
                >
                  <IconZoomOut />
                </IconButton>
                <div
                  className="zoom-display"
                  onClick={adjustZoomToFit}
                  title="Fit to screen"
                >
                  {zoomLevel}%
                </div>
                <IconButton
                  onClick={() => handleZoomButtonClick(10)}
                  title="Zoom In"
                >
                  <IconZoomIn />
                </IconButton>
              </div>
              <IconButton
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title="Undo"
              >
                <IconUndo />
              </IconButton>
              <IconButton
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="Redo"
              >
                <IconRedo />
              </IconButton>
              <IconButton
                onClick={() => {
                  setStatus("idle");
                  setActiveTab("generate");
                }}
                title="Regenerate Report"
              >
                <IconRefresh />
              </IconButton>
            </div>
          </div>
          <div ref={mobilePreviewRef} className="preview-canvas">
            <ReportDisplay {...reportDisplayProps} />
          </div>
          <div className="mobile-preview-footer">
            <button
              onClick={() => setMobilePanel("format")}
              className={mobilePanel === "format" ? "active" : ""}
            >
              <IconTypography />
              <span>Format</span>
            </button>
            <button
              onClick={() => setMobilePanel("header")}
              className={mobilePanel === "header" ? "active" : ""}
            >
              <IconHeaderFooter />
              <span>Header</span>
            </button>
            <button
              onClick={() => setMobilePanel("export")}
              className={mobilePanel === "export" ? "active" : ""}
            >
              <IconExport />
              <span>Export</span>
            </button>
          </div>
          <MobilePanel
            panel={mobilePanel}
            onClose={() => setMobilePanel(null)}
            title={
              mobilePanel === "format"
                ? "Formatting"
                : mobilePanel === "header"
                ? "Header & Footer"
                : "Export"
            }
          >
            {mobilePanel === "format" && formattingPanelContent}
            {mobilePanel === "header" && headerFooterPanelContent}
            {mobilePanel === "export" && exportPanelContent}
          </MobilePanel>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`app-container ${
        activeTab === "preview" ? "" : "constrained-width"
      }`}
    >
      <header>
        <div className="header-content">
          <h1>AI Report Generator</h1>
          <p>Instantly create professional, multi-page reports on any topic.</p>
        </div>
        <div className="header-actions">
          <div className="header-button-stack">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              <IconSun className="sun-icon" />
              <IconMoon className="moon-icon" />
            </button>
            <IconButton
              ref={contactButtonRef}
              onClick={() => setIsContactPopoverOpen((prev) => !prev)}
              title="Contact Info"
              className={`contact-button ${
                isContactPopoverOpen ? "active" : ""
              }`}
            >
              <IconUser />
            </IconButton>
          </div>
        </div>
      </header>
      <main className="main-content">
        <nav className="tabs-nav">
          <button
            className={`tab-button ${activeTab === "generate" ? "active" : ""}`}
            onClick={() => setActiveTab("generate")}
          >
            Generate
          </button>
          <button
            className={`tab-button ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
            disabled={reportBlocks.length === 0 && !error}
          >
            Preview & Edit
          </button>
        </nav>

        {activeTab === "generate" && (
          <div className="controls-card">
            <div className="input-group">
              <label htmlFor="report-topic">Report Topic</label>
              <div className="textarea-wrapper">
                <textarea
                  id="report-topic"
                  placeholder="e.g., The history of renewable energy sources"
                  value={reportTopic}
                  onChange={(e) => setReportTopic(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="num-pages">Target Number of Pages</label>
              <input
                id="num-pages"
                type="number"
                min="1"
                max="10"
                value={numberOfPages}
                onChange={(e) => setNumberOfPages(e.target.value)}
              />
            </div>

            <div className="info-section">
              <h4>How It Works</h4>
              <p>
                The AI will generate a report aiming for your target page count
                by estimating about <strong>450 words per page</strong>. After
                generation, you can use the <strong>Auto-Fit</strong> feature in
                the preview tab to fine-tune the formatting to match the page
                count precisely.
              </p>
            </div>

            <div className="input-group-inline checkbox-group thinking-mode-group">
              <input
                id="thinking-mode"
                type="checkbox"
                checked={isThinkingModeEnabled}
                onChange={(e) => setIsThinkingModeEnabled(e.target.checked)}
              />
              <label htmlFor="thinking-mode">
                Enable High-Quality Mode
                <span className="subtle-text">
                  {" "}
                  (Uses Gemini 2.5 Pro for more detailed reports, may take
                  longer)
                </span>
              </label>
            </div>

            {status === "error" && <p className="error-message">{error}</p>}

            <button
              className="generate-button"
              onClick={handleGenerateReport}
              disabled={status === "loading" || !API_KEY}
            >
              {status === "loading" ? "Generating..." : "Generate Report"}
            </button>
          </div>
        )}

        {activeTab === "preview" && renderPreview()}
      </main>

      <ContactPopover
        isOpen={isContactPopoverOpen}
        onClose={() => setIsContactPopoverOpen(false)}
        anchorRef={contactButtonRef}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
