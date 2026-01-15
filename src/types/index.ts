export interface WatermarkItem {
  id: string;
  label: string;
  value: string;
}

export interface WatermarkData {
  title: string;
  items: WatermarkItem[];
}

export interface WatermarkStyle {
  boxWidthScale: number;
  headerFontSizeScale: number;
  bodyFontSizeScale: number;
  headerColor: string;
  headerOpacity: number;
  headerTextColor: string;
  headerFontFamily: string;
  headerFontWeight: string;
  bodyColor: string;
  bodyOpacity: number;
  bodyTextColor: string;
  bodyFontFamily: string;
  bodyFontWeight: string;
}

export interface FontOption {
  label: string;
  value: string;
}
