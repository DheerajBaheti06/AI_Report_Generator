import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleGenAI, Type } from "@google/genai";
import { jsPDF } from "jspdf";
import * as docx from "docx";
import html2canvas from "html2canvas";

// Local imports
import {
  ReportBlock,
  BlockStyle,
  FormattingOptions,
  HistoryEntry,
} from "./types";
import {
  THEME_DEFAULT_COLORS,
  DEFAULT_HEADINGS,
  API_KEY,
  PAGE_WIDTH_IN,
  PAGE_HEIGHT_IN,
  DPI,
} from "./constants";
import { generateId, decode } from "./utils";
import {
  IconRefresh,
  IconUndo,
  IconRedo,
  IconFileDoc,
  IconFilePdf,
  IconTypography,
  IconPageSetup,
  IconHeaderFooter,
  IconExport,
  IconZoomIn,
  IconZoomOut,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustify,
  IconSun,
  IconMoon,
  IconUser,
} from "./components/ui/Icons";
import { IconButton } from "./components/ui/IconButton";
import { ContactPopover } from "./components/ContactPopover";
import { MobilePanel } from "./components/MobilePanel";
import { ReportDisplay } from "./components/ReportDisplay";
import { EditableBlock } from "./components/EditableBlock"; // Needed for calculatePages

const App = () => {
  const [reportTopic, setReportTopic] = React.useState("");
  const [specificHeadings, setSpecificHeadings] =
    React.useState(DEFAULT_HEADINGS);
  const [numberOfPages, setNumberOfPages] = React.useState("3");
  const [reportBlocks, setReportBlocks] = React.useState<ReportBlock[]>([]);
  const [formattingOptions, setFormattingOptions] =
    React.useState<FormattingOptions>({
      fontSize: "12px",
      fontFamily: "Times New Roman",
      lineSpacing: "1.5",
      textAlign: "justify",
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
    "generate",
  );
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(
    null,
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
    [],
  );
  const [exportMessage, setExportMessage] = React.useState("");
  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth <= 900,
  );
  const [theme, setTheme] = React.useState("dark");
  const [isContactPopoverOpen, setIsContactPopoverOpen] = React.useState(false);
  const [cooldownTimer, setCooldownTimer] = React.useState(0); // Rate limit timer in seconds

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

  // Sidebar Sync REMOVED as per user request (Sidebar = Global Defaults)

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
        </div>,
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const pages: ReportBlock[][] = [];
      let currentPage: ReportBlock[] = [];
      let currentHeight = 0;
      const PAGE_CONTENT_HEIGHT_PX = (PAGE_HEIGHT_IN - 2) * DPI;

      const measuredWrappers = Array.from(
        measurementContainer.querySelectorAll(".editable-block-wrapper"),
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
    [history, historyIndex],
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
          `Content is too long to fit into ${targetPageCount} pages. We've made it as compact as possible.`,
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
          `✨ Auto-Fit Applied: Your report has been formatted to fit ${targetPageCount} pages.`,
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
          ".pages-container-wrapper",
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
      ".pages-container-wrapper",
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

  // Rate Limiting Timer
  React.useEffect(() => {
    if (cooldownTimer > 0) {
      const timerId = setTimeout(
        () => setCooldownTimer((prev) => prev - 1),
        1000,
      );
      return () => clearTimeout(timerId);
    }
  }, [cooldownTimer]);

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
      target: EventTarget | null,
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
          touch1.clientY - touch2.clientY,
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
          touch1.clientY - touch2.clientY,
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
        "Cannot generate report: AI service is not initialized. Check your GEMINI_API_KEY configuration in your environment variables.",
      );
      setStatus("error");
      return;
    }
    if (!reportTopic) {
      setError("Please enter a topic for the report.");
      setStatus("error");
      return;
    }

    if (cooldownTimer > 0) return;

    setStatus("loading");
    setActiveTab("preview");
    setError("");
    setAutoFitMessage("");

    const pageCount = parseInt(numberOfPages) || 1;
    // Calibrating word count. 600 was too high (resulted in double length).
    // 400 is a safer target to ensure completion without hitting token limits.
    const wordCount = pageCount * 400;
    const minWords = Math.floor(wordCount * 0.85);
    const maxWords = Math.floor(wordCount * 1.15);

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

    const systemInstruction = `You are a professional report writer AI. 
    Your goal is to produce a high-quality, professional report.
    **STYLE GUIDELINES:**
    1. **PREFER PARAGRAPHS**: Do not use bullet points to unnecessarily increase length. Write in cohesive, well-structured paragraphs.
    2. **NO FLUFF**: Do not add unnecessary explanations just to fill space. Content must be meaningful.
    3. **COMPLETE THE REPORT**: It is critical that you cover ALL sections of the provided outline. Do not spend too many tokens on the Introduction and run out of space for the Conclusion. Manage your length to finish the document.`;

    const prompt = `Generate a report on the topic: "${reportTopic}".

${
  specificHeadings.trim()
    ? `**STRICT STRUCTURE REQUIREMENT**:
You MUST follow the exact structure provided below for the main headings and subheadings.
The content under each heading must be relevant to the topic "${reportTopic}" while adhering to this outline.
If a section in the outline is not applicable to the topic, briefly mention it or adapt it slightly, but DO NOT remove the main headings.

**REQUIRED OUTLINE**:
${specificHeadings}
`
    : ""
}

**CRITICAL CONTENT REQUIREMENTS:**

1.  **Hardware & Software Requirements**: 
    -   **STRICTLY TECHNICAL SPECS ONLY**. 
    -   **NO DEFINITIONS OR EXPLANATIONS**. Do NOT explain what "RAM", "Processor", or "IDE" is. We know what they are.
    -   **FORMAT**: "Requirement: Value/Version" (e.g., "RAM: 16GB", "Node.js: v18+").
    -   If you explain *why* a requirement is needed, act as if you are writing a spec sheet, not a textbook.
    -   **FAILURE TO COMPLY**: Any theoretical explanation (e.g., "RAM is temporary storage...") will be considered a failure.
2.  **TARGET WORD COUNT**: Approx **${wordCount} words**. Use this as a guide to pace yourself.
3.  **Content Distribution**:
    -   Methodology, Discussion, and Architecture should range in depth.
    -   Intro and Requirements should be to-the-point.
4.  **EXPAND WITH SUB-SUB-HEADINGS**:
    -   Use **Heading Level 2 (heading2)** for major subsections.
    -   Use **Heading Level 3 (heading3)** frequently to break down complex topics into finer details. This is the best way to add natural length.
    -   Example structure: 
        -   Heading 1: Methodology
            -   Heading 2: System Architecture
                -   Heading 3: Frontend Design
                -   Heading 3: Backend Logic
                -   Heading 3: Database Schema

**Output Format Instructions:**
- You MUST respond with a single, valid JSON object that strictly adheres to the provided schema.
- The JSON object must be structured as: { "report": [ { "type": "...", "text": "..." } ] }.
- Allowed "type" values are: "heading1", "heading2", "heading3", "paragraph", "bullet", "numbered".
- Do NOT include a main title at the very beginning (like a "heading1" with the report topic). Start directly with the first section heading.
- Do NOT output markdown, backticks, or any text outside of the JSON structure.`;

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
        textAlign: "justify",
      };

      const newReport: ReportBlock[] = parsedResponse.report.map(
        (block: any, index: number) => {
          let style = { ...baseStyle };
          if (block.type === "heading1") {
            style = { ...style, fontSize: "16px", bold: true };
          } else if (block.type === "heading2") {
            style = { ...style, fontSize: "13px", bold: true };
          } else if (block.type === "heading3") {
            style = { ...style, fontSize: "12px", bold: true };
          } else {
            // For paragraph, bullet, numbered, and others
            style = { ...style, fontSize: "12px" };
            if (block.type === "paragraph") {
              // Just to be explicit, though generic fallback covers it
              style = { ...style, fontSize: "12px" };
            }
          }

          if (block.type === "image") {
            style = { ...style, fontSize: "12px" }; // Images don't really use this, but for consistency
          }

          return {
            id: generateId(),
            type: block.type,
            text: block.text,
            style: style,
            // Force page break for main headings, EXCEPT the very first block of the report
            pageBreakBefore: block.type === "heading1" && index > 0,
          };
        },
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
        if (
          err.message.includes("429") ||
          err.message.toLowerCase().includes("exhausted")
        ) {
          errorMessage =
            "⚠️ Traffic is high. Please wait a moment before trying again (Rate Limit Reached).";
          setCooldownTimer(30); // Longer cooldown for rate limits
        } else {
          errorMessage = `An error occurred: ${err.message}`;
        }
      }
      setError(errorMessage);
      setStatus("error");
    } finally {
      // Start cooldown to prevent spamming
      setCooldownTimer(10);
    }
  };

  // --- STYLING & EDITING ---
  const handleGlobalFormatChange = (
    option: keyof FormattingOptions,
    value: any,
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
      b.id === id ? { ...b, text: newText.replace(/^• |^\d+\. /, "") } : b,
    );
    setReportBlocks(newReport);
    updateHistory(newReport, formattingOptions);
  };

  const handleStyleChange = (
    blockId: string,
    style: Partial<BlockStyle>,
    newText?: string,
  ) => {
    setAutoFitMessage("");
    const newReport = reportBlocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          style: { ...b.style, ...style },
          text:
            newText !== undefined ? newText.replace(/^• |^\d+\. /, "") : b.text,
        };
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
        document.querySelectorAll(".output-page"),
      ) as HTMLElement[];
      const visiblePageElements = allPageElements.filter(
        (el) => el.offsetParent !== null,
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
            }),
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
            "FAST",
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
        PageBorderOffsetFrom,
        PageBorderZOrder,
        BorderStyle,
        PageBorderDisplay,
        Table,
        TableRow,
        TableCell,
        WidthType,
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
        dataUrl: string,
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
              line: Math.round(
                (parseFloat(formattingOptions.lineSpacing) || 1.5) * 240,
              ),
            },
            alignment: getAlignment(formattingOptions.textAlign),
          };

          const fontSizeInPoints = parseInt(block.style.fontSize) * 0.75;
          switch (block.type) {
            case "heading1":
              paragraphConfig.spacing.before = pointsToTwips(
                fontSizeInPoints * 1.5,
              );
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.4,
              );
              break;
            case "heading2":
              paragraphConfig.spacing.before = pointsToTwips(
                fontSizeInPoints * 1.2,
              );
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.4,
              );
              break;
            case "heading3":
              paragraphConfig.spacing.before = pointsToTwips(
                fontSizeInPoints * 1.0,
              );
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.4,
              );
              break;
            case "paragraph":
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.5,
              );
              break;
            case "bullet":
            case "numbered":
              paragraphConfig.spacing.after = pointsToTwips(
                fontSizeInPoints * 0.2,
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
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  insideHorizontal: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: "auto",
                  },
                  insideVertical: {
                    style: BorderStyle.NONE,
                    size: 0,
                    color: "auto",
                  },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(formattingOptions.footer)],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: formattingOptions.showPageNumbers
                              ? [
                                  new TextRun({
                                    children: [PageNumber.CURRENT],
                                  }),
                                ]
                              : [],
                          }),
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
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
            pageBorders: formattingOptions.showBorders
              ? {
                  display: PageBorderDisplay.ALL_PAGES,
                  offsetFrom: PageBorderOffsetFrom.PAGE,
                  zOrder: PageBorderZOrder.BACK,
                  top: {
                    style: BorderStyle.SINGLE,
                    size: 24,
                    color: "000000",
                    space: 24,
                  },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 24,
                    color: "000000",
                    space: 24,
                  },
                  left: {
                    style: BorderStyle.SINGLE,
                    size: 24,
                    color: "000000",
                    space: 24,
                  },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: 24,
                    color: "000000",
                    space: 24,
                  },
                }
              : undefined,
          },
        },
        children: children as any[],
      };

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
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="'Courier New', monospace">Courier New</option>
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
              <label htmlFor="specific-headings">
                Specific Main Headings (Optional)
              </label>
              <div className="textarea-wrapper" style={{ height: "200px" }}>
                <textarea
                  id="specific-headings"
                  placeholder="Enter your desired report structure here..."
                  value={specificHeadings}
                  onChange={(e) => setSpecificHeadings(e.target.value)}
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
              disabled={status === "loading" || !API_KEY || cooldownTimer > 0}
            >
              {status === "loading"
                ? "Generating..."
                : cooldownTimer > 0
                  ? `Wait ${cooldownTimer}s...`
                  : "Generate Report"}
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

export default App;
