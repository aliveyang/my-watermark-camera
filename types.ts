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
  // Dimensions
  boxWidthScale: number;
  
  // Font Sizes
  headerFontSizeScale: number;
  bodyFontSizeScale: number;
  
  // Header Style
  headerColor: string;
  headerOpacity: number;
  headerTextColor: string;
  headerFontFamily: string;
  headerFontWeight: string;

  // Body Style
  bodyColor: string;
  bodyOpacity: number;
  bodyTextColor: string;
  bodyFontFamily: string;
  bodyFontWeight: string;
}