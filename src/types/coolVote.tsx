// For drawing the chart
interface Parent {
  // each data point is a parent value
  _id: string;
  value: number;
}
export interface ChartState {
  data: Parent[];
}

export interface ChartProps {
  // need a url to get data
  url: string;
  refreshInterval?: number;
}
