import { useState } from "react";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarPsifosGraph({ data, label, title, onlyHour }) {
  const [graphData, setGraphData] = useState({});
  const [options, setOptions] = useState({});
  useEffect(() => {
    const labels = Object.keys(data).map((label) => {
      if (onlyHour) return label.split(" ")[1];
      else return label;
    });
    const dataAux = {
      labels,
      datasets: [
        {
          label: label,
          data: Object.values(data),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        y: {
          ticks: {
            stepSize: 1,
          },
        },
      },
    };
    setGraphData(dataAux);
    setOptions(options);
  }, [data]);

  return (
    <>
      {Object.keys(graphData).length !== 0 &&
        Object.keys(data).length !== 0 && (
          <div className="canvas-graph">
            <Bar data={graphData} options={options} />
          </div>
        )}
    </>
  );
}

export default BarPsifosGraph;
