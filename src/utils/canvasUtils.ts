import { WatermarkData, WatermarkStyle } from '../types';

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number => {
  const words = text.split('');
  let line = '';
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

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl: number; tr: number; br: number; bl: number },
) => {
  if (typeof radius === 'number') {
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
  style: WatermarkStyle,
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imageSrc;

  await new Promise(resolve => {
    img.onload = resolve;
  });

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  const baseWmWidth = canvas.width > canvas.height ? canvas.width * 0.4 : canvas.width * 0.55;
  const wmWidth = baseWmWidth * style.boxWidthScale;

  const padding = wmWidth * 0.05;

  const baseFontSizeRef = wmWidth * 0.055;

  const headerFontSize = baseFontSizeRef * style.headerFontSizeScale;
  const bodyFontSize = baseFontSizeRef * 0.85 * style.bodyFontSizeScale;

  const lineHeight = bodyFontSize * 1.5;
  const headerHeight = headerFontSize * 2.2;

  ctx.font = `${style.bodyFontWeight} ${bodyFontSize}px ${style.bodyFontFamily}`;

  const labelWidth = bodyFontSize * 5.5;
  const contentWidth = wmWidth - padding * 2 - labelWidth;

  let bodyHeight = padding * 2;

  const estimateWrapLines = (text: string, maxWidth: number) => {
    let lines = 1;
    let line = '';
    const words = text.split('');
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

  if (data.items.length === 0) {
    bodyHeight += lineHeight;
  } else {
    data.items.forEach(item => {
      const lines = estimateWrapLines(item.value, contentWidth);
      bodyHeight += lines * lineHeight;
    });
  }

  const totalHeight = headerHeight + bodyHeight;

  const margin = canvas.width * 0.03;
  const x = margin;
  const y = canvas.height - totalHeight - margin;
  const radius = wmWidth * 0.04;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, x, y, wmWidth, totalHeight, radius);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.0)';
  ctx.fill();
  ctx.restore();

  ctx.save();
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

  ctx.globalAlpha = style.headerOpacity;
  ctx.fillStyle = style.headerColor;
  ctx.fillRect(x, y, wmWidth, headerHeight);
  ctx.restore();

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

  ctx.globalAlpha = style.bodyOpacity;
  ctx.fillStyle = style.bodyColor;
  ctx.fillRect(x, y + headerHeight, wmWidth, totalHeight - headerHeight);
  ctx.restore();

  const dotRadius = headerFontSize * 0.25;
  const dotX = x + padding;
  const dotY = y + headerHeight / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#f5db4b';
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = style.headerTextColor;
  ctx.font = `${style.headerFontWeight} ${headerFontSize}px ${style.headerFontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(data.title, dotX + dotRadius * 3, dotY);

  ctx.fillStyle = style.bodyTextColor;
  ctx.font = `${style.bodyFontWeight} ${bodyFontSize}px ${style.bodyFontFamily}`;
  ctx.textBaseline = 'top';

  const labelX = x + padding;
  const valueX = x + padding + labelWidth;
  let currentContentY = y + headerHeight + padding;

  const drawRow = (label: string, value: string) => {
    ctx.fillText(label, labelX, currentContentY);
    const nextY = wrapText(ctx, value, valueX, currentContentY, contentWidth, lineHeight);
    currentContentY = nextY;
  };

  data.items.forEach(item => {
    drawRow(item.label, item.value);
  });
};
