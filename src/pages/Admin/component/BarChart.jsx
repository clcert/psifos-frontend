import React from "react";
import ReactEcharts from "echarts-for-react";

const getOptions = ({
    keys, values, title, subtitle, visualMap, markLine, valueMeaning,
}) => {
    return {
        title: {
            text: title,
            subtext: subtitle,
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: true },
            }
        },
        calculable: true,
        yAxis: [
            {
                type: 'category',
                data: keys,
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        visualMap: visualMap,
        series: [
            {
                name: valueMeaning,
                type: 'bar',
                data: values,
                markLine: {
                    data: [markLine]
                }
            }
        ]
    }
}

export default function BarChart(props) {
    const options = getOptions(props)
    return (
        <ReactEcharts option={options} />
    )
}