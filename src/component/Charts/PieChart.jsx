import ReactEcharts from "echarts-for-react";
import { getGradientPalette } from "../../utils";

const renderChartData = (dataObj) => {
  return Object.entries(dataObj).map(
    ([name, value]) => ({
      name,
      value,
    })
  )
}

export default function PieChart({
  data, legendPosition, chartPosition, mediaChartPosition,
}) {
  const renderedData = renderChartData(data)
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
          label: {
            show: false,
          },
          type: 'pie',
          radius: ['30%'],
          color: getGradientPalette(renderedData.length),
          data: renderedData,
          ...chartPosition
        }
      ],
      media: [
        {
          query: { minAspectRatio: 0.5 },
          option: {
            series: [
              chartPosition,
            ]
          }
        },
        {
          option: {
            series: [
              mediaChartPosition,
            ]
          }
        }
      ]
  };
  return (
      <ReactEcharts option={options} />
  )
}