import React from "react";
import { IconButton } from "./ui/IconButton";
import {
  IconLinkedIn,
  IconGitHub,
  IconCopy,
  IconExternalLink,
} from "./ui/Icons";

export const ContactPopover: React.FC<{
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
        Math.min(leftPosition, window.innerWidth - popoverWidth - 16),
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
