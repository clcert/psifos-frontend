import ReactEcharts from "echarts-for-react";
import { getGradientPalette } from "../../utils";

export function PieChart({ data, legendPosition, chartPosition }) {
  const options = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        ...legendPosition
      },
      series: [
        {
          type: 'pie',
          radius: ['30%'],
          color: getGradientPalette(data.length),
          data: data,
          ...chartPosition
        }
      ],
  };
  return (
      <ReactEcharts option={options} />
  )
}