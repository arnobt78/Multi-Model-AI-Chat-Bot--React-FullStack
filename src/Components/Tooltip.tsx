import React, { useState, useRef, useEffect } from "react";
import "./Tooltip.css";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [finalPosition, setFinalPosition] = useState(position);
  const [isFixed, setIsFixed] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getAdjustedPosition = () => {
    if (!wrapperRef.current) return position;

    const rect = wrapperRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check available space in each direction
    const spaceTop = rect.top;
    const spaceBottom = viewportHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;

    // Estimate tooltip size (roughly)
    const tooltipWidth = text.length * 8 + 32; // Approximate width
    const tooltipHeight = 40; // Approximate height

    let adjustedPosition = position;

    // Adjust position if there's not enough space
    if (position === "top" && spaceTop < tooltipHeight + 10) {
      adjustedPosition = "bottom";
    } else if (position === "bottom" && spaceBottom < tooltipHeight + 10) {
      adjustedPosition = "top";
    } else if (position === "left" && spaceLeft < tooltipWidth + 10) {
      adjustedPosition = "right";
    } else if (position === "right" && spaceRight < tooltipWidth + 10) {
      adjustedPosition = "left";
    }

    return adjustedPosition;
  };

  const calculateFixedPosition = (pos: string) => {
    if (!wrapperRef.current) return {};

    const rect = wrapperRef.current.getBoundingClientRect();

    let style: React.CSSProperties = {};

    switch (pos) {
      case "top":
        style.top = `${rect.top}px`;
        style.left = `${rect.left + rect.width / 2}px`;
        style.transform = "translate(-50%, calc(-100% - 8px))";
        break;
      case "bottom":
        style.top = `${rect.bottom}px`;
        style.left = `${rect.left + rect.width / 2}px`;
        style.transform = "translate(-50%, 8px)";
        break;
      case "left":
        style.top = `${rect.top + rect.height / 2}px`;
        style.left = `${rect.left}px`;
        style.transform = "translate(calc(-100% - 8px), -50%)";
        break;
      case "right":
        style.top = `${rect.top + rect.height / 2}px`;
        style.left = `${rect.right}px`;
        style.transform = "translate(8px, -50%)";
        break;
    }

    return style;
  };

  const handleMouseEnter = () => {
    // Check if the wrapped element is position: fixed
    let elementIsFixed = false;
    if (wrapperRef.current && wrapperRef.current.firstElementChild) {
      const element = wrapperRef.current.firstElementChild as HTMLElement;
      const styles = window.getComputedStyle(element);
      if (styles.position === "fixed") {
        elementIsFixed = true;
        setIsFixed(true);
      }
    }

    const adjustedPos = getAdjustedPosition();
    setFinalPosition(adjustedPos);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      if (elementIsFixed) {
        setTooltipStyle(calculateFixedPosition(adjustedPos));
      }
    }, 150);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`tooltip-wrapper ${isFixed ? "tooltip-wrapper-fixed" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip-${finalPosition}`}
          style={isFixed ? tooltipStyle : {}}
        >
          {text}
          <div className={`tooltip-arrow tooltip-arrow-${finalPosition}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
