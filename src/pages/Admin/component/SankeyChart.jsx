import React from "react";
import ReactEcharts from "echarts-for-react";

const getOptions = (nodes, edges, labelFormatter) => {
    return {
        series: {
            type: 'sankey',
            layout: 'none',
            emphasis: {
              focus: 'adjacency',
            },
            data: nodes,
            links: edges,
            label: {
                formatter: labelFormatter,
            },
            lineStyle: {
                color: 'source',
            }
        }
    }
}

export default function SankeyChart({
    nodes, edges, labelFormatter,
}) {
    const options = getOptions(nodes, edges, labelFormatter)
    return (
        <div
            className="ranking-illustration-bottom"
        >
            <ReactEcharts option={options} />
        </div>
    )
}