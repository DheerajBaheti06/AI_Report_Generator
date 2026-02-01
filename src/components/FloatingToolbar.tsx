import React from "react";
import { ReportBlock, BlockStyle } from "../types";
import { IconPageBreak } from "./ui/Icons";

interface FloatingToolbarProps {
  targetElement: HTMLElement | null;
  block: ReportBlock | null;
  onStyleChange: (blockId: string, style: Partial<BlockStyle>) => void;
  onApplyStyleToAll: (block: ReportBlock) => void;
  onPageBreakToggle: (blockId: string) => void;
}

export const FloatingToolbar = React.forwardRef<
  HTMLDivElement,
  FloatingToolbarProps
>(
  (
    {
      targetElement,
      block,
      onStyleChange,
      onApplyStyleToAll,
      onPageBreakToggle,
    },
    ref,
  ) => {
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const [isVisible, setIsVisible] = React.useState(false);
    const [isFaded, setIsFaded] = React.useState(false);
    const hideTimerRef = React.useRef<number | null>(null);
    const lastSelectionRectRef = React.useRef<DOMRect | null>(null);

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
        const margin = 45;

        // Try to get selection coordinates for precise positioning
        let rect = targetRect;
        const selection = window.getSelection();

        // Use a ref to store the last known good selection rect to handle cases where
        // focus is temporarily lost (e.g., color picker dialog)
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rangeRect = range.getBoundingClientRect();
          // Only use range rect if it's valid and inside the target element
          if (rangeRect.width > 0 || rangeRect.height > 0) {
            rect = rangeRect;
            lastSelectionRectRef.current = rangeRect;
          }
        } else if (lastSelectionRectRef.current) {
          // Fallback: If selection is lost (e.g. focused on color picker), use the last known position
          // This keeps the toolbar stable instead of jumping to the block center
          rect = lastSelectionRectRef.current;
        }

        const idealLeft =
          rect.left -
          containerRect.left +
          scrollLeft +
          rect.width / 2 -
          toolbarWidth / 2;

        let idealTop;
        const spaceAboveInViewport = rect.top - containerRect.top;

        // Prefer to place the toolbar above if there is enough space in the visible canvas area.
        if (spaceAboveInViewport >= toolbarHeight + margin) {
          idealTop =
            rect.top - containerRect.top + scrollTop - toolbarHeight - margin;
        } else {
          // Otherwise, place it below.
          idealTop = rect.bottom - containerRect.top + scrollTop + margin;
        }

        // Clamp position to ensure it stays within the visible canvas area
        const finalLeft = Math.max(
          scrollLeft + 5,
          Math.min(idealLeft, scrollLeft + clientWidth - toolbarWidth - 5),
        );

        const finalTop = Math.max(
          scrollTop + 5,
          Math.min(idealTop, scrollTop + clientHeight - toolbarHeight - 5),
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
          zIndex: 1000,
        }}
        onMouseDown={(e) => {
          // ALWAYS stop propagation to prevent document listeners (handleClickOutside)
          // from hiding the toolbar when interacting with ANY part of it (input or button)
          e.stopPropagation();

          const target = e.target as HTMLElement;
          if (target.tagName === "INPUT") {
            // Do not prevent default for inputs (allows focus/interaction)
            return;
          }
          // Buttons should use onClick but NOT steal focus (mousedown default behavior)
          e.preventDefault();
        }}
        onMouseEnter={cancelHideTimer}
        onMouseLeave={startHideTimer}
      >
        {block && (
          <>
            {isTextBasedBlock && (
              <>
                <input
                  type="color"
                  value={(() => {
                    // Ensure valid 6-digit hex for color input
                    const c = block.style.color;
                    if (c.startsWith("#") && c.length === 7) return c;
                    // Fallback for short hex or named colors (simplistic)
                    if (c.startsWith("#") && c.length === 4) {
                      return `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
                    }
                    // For named colors, we'd need a map, but default themes are hex.
                    // Return black/default if invalid to avoid input error.
                    return "#000000";
                  })()}
                  onChange={(e) =>
                    onStyleChange(block.id, { color: e.target.value })
                  }
                  onClick={(e) => e.stopPropagation()}
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
  },
);
