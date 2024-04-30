import ReactEcharts from "echarts-for-react";
import { colors } from "../../constants";

export function PieChart({ data, legendPosition, chartPosition }) {
    const colors = [
      colors.principalBlue,
      colors.gradientSecondBlue,
      colors.gradientThirdBlue,
      colors.gradientFourthBlue,
    ]
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
            color: colors,
            data: data,
            ...chartPosition
          }
        ],
    };
    return (
        <ReactEcharts option={options} />
    )
}