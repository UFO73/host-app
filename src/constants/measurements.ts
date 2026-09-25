import { ViewerTool } from '../bridge/contract';

export const measurementStatusLabels = {
  waiting: 'Очікує',
  drawing: 'Малювання…',
  completed: 'Готово',
} as const;

export const measurementToolLabels = {
  [ViewerTool.ELLIPTICAL_ROI]: 'Еліпс',
  [ViewerTool.LENGTH]: 'Довжина',
} as const;

export const measurementToolOptions = [
  { label: measurementToolLabels[ViewerTool.ELLIPTICAL_ROI], value: ViewerTool.ELLIPTICAL_ROI },
  { label: measurementToolLabels[ViewerTool.LENGTH], value: ViewerTool.LENGTH },
] as const;
