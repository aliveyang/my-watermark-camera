import { WatermarkData, WatermarkStyle } from "../types";

/**
 * Wraps text onto the canvas context.
 */
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number => {
  const words = text.split(""); // Split by char for better CJK wrapping
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
};

/**
 * Draws a rounded rectangle path.
 */
const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl: number; tr: number; br: number; bl: number }
) => {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
};

export const drawWatermarkedImage = async (
  canvas: HTMLCanvasElement,
  imageSrc: string,
  data: WatermarkData,
  style: WatermarkStyle
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageSrc;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Set canvas size to match image resolution (high quality)
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw original image
  ctx.drawImage(img, 0, 0);

  // --- Watermark Configuration ---
  // Scale watermark relative to image width. 
  // Base calculation
  const baseWmWidth = canvas.width > canvas.height ? canvas.width * 0.4 : canvas.width * 0.55;
  // Apply user box width scale
  const wmWidth = baseWmWidth * style.boxWidthScale;
  
  const padding = wmWidth * 0.05; // Internal padding
  
  // Base font size derived from box width to maintain proportions by default
  const baseFontSizeRef = wmWidth * 0.055;
  
  // Calculate independent font sizes
  const headerFontSize = baseFontSizeRef * style.headerFontSizeScale;
  const bodyFontSize = baseFontSizeRef * 0.85 * style.bodyFontSizeScale; 
  
  const lineHeight = bodyFontSize * 1.5;
  const headerHeight = headerFontSize * 2.2;
  
  // Measure wrap height using body font settings
  // Apply dynamic body font settings
  ctx.font = `${style.bodyFontWeight} ${bodyFontSize}px ${style.bodyFontFamily}`;
  
  const labelWidth = bodyFontSize * 5.5; // Width for label column
  const contentWidth = wmWidth - (padding * 2) - labelWidth;
  
  // Calculate dynamic body height based on items
  let bodyHeight = padding * 2; // Top/bottom body padding
  
  const estimateWrapLines = (text: string, maxWidth: number) => {
     let lines = 1;
     let line = "";
     const words = text.split("");
     for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        if (ctx.measureText(testLine).width > maxWidth && i > 0) {
            lines++;
            line = words[i];
        } else {
            line = testLine;
        }
     }
     return lines;
  };

  // Calculate height for each item
  if (data.items.length === 0) {
    bodyHeight += lineHeight; // Minimum height if empty
  } else {
    data.items.forEach(item => {
       const lines = estimateWrapLines(item.value, contentWidth);
       bodyHeight += lines * lineHeight;
    });
  }

  const totalHeight = headerHeight + bodyHeight;

  // Position: Bottom Left with some margin
  const margin = canvas.width * 0.03;
  const x = margin;
  const y = canvas.height - totalHeight - margin;
  const radius = wmWidth * 0.04;

  // --- Draw Container Shadow ---
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, x, y, wmWidth, totalHeight, radius);
  ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
  ctx.fill();
  ctx.restore();

  // --- Draw Header ---
  ctx.save();
  // Clip the top rounded corners
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + wmWidth - radius, y);
  ctx.quadraticCurveTo(x + wmWidth, y, x + wmWidth, y + radius);
  ctx.lineTo(x + wmWidth, y + headerHeight);
  ctx.lineTo(x, y + headerHeight);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();
  
  // Fill Header with Custom Color & Opacity
  ctx.globalAlpha = style.headerOpacity;
  ctx.fillStyle = style.headerColor;
  ctx.fillRect(x, y, wmWidth, headerHeight);
  ctx.restore();

  // --- Draw Body ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + headerHeight);
  ctx.lineTo(x + wmWidth, y + headerHeight);
  ctx.lineTo(x + wmWidth, y + totalHeight - radius);
  ctx.quadraticCurveTo(x + wmWidth, y + totalHeight, x + wmWidth - radius, y + totalHeight);
  ctx.lineTo(x + radius, y + totalHeight);
  ctx.quadraticCurveTo(x, y + totalHeight, x, y + totalHeight - radius);
  ctx.lineTo(x, y + headerHeight);
  ctx.closePath();
  ctx.clip();

  // Fill Body with Custom Color & Opacity
  ctx.globalAlpha = style.bodyOpacity;
  ctx.fillStyle = style.bodyColor;
  ctx.fillRect(x, y + headerHeight, wmWidth, totalHeight - headerHeight);
  ctx.restore();

  // --- Draw Header Content ---
  // Yellow Dot
  const dotRadius = headerFontSize * 0.25;
  const dotX = x + padding;
  const dotY = y + (headerHeight / 2);
  
  ctx.save();
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#f5db4b"; // Keep dot yellow for specific look
  ctx.fill();
  ctx.restore();

  // Title Text
  ctx.fillStyle = style.headerTextColor; 
  // Apply dynamic header font settings
  ctx.font = `${style.headerFontWeight} ${headerFontSize}px ${style.headerFontFamily}`;
  ctx.textBaseline = "middle";
  ctx.fillText(data.title, dotX + dotRadius * 3, dotY);

  // --- Draw Body Content ---
  ctx.fillStyle = style.bodyTextColor;
  // Apply dynamic body font settings
  ctx.font = `${style.bodyFontWeight} ${bodyFontSize}px ${style.bodyFontFamily}`;
  ctx.textBaseline = "top";
  
  const labelX = x + padding;
  const valueX = x + padding + labelWidth; // Align values
  let currentContentY = y + headerHeight + padding;

  // Helper to draw row
  const drawRow = (label: string, value: string) => {
      // Draw Label
      ctx.fillText(label, labelX, currentContentY);
      
      // Draw Value (Wrapped)
      const nextY = wrapText(ctx, value, valueX, currentContentY, contentWidth, lineHeight);
      currentContentY = nextY;
  };

  data.items.forEach(item => {
    drawRow(item.label, item.value);
  });
};