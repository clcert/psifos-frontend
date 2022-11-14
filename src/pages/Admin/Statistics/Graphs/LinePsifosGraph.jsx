import { useState } from "react";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LinePsifosGraph(props) {
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});
  useEffect(() => {
    const labels = Object.keys(props.data);
    const dataAux = {
      labels,
      datasets: [
        {
          label: props.label,
          data: Object.values(props.data),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: props.title,
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
    setData(dataAux);
    setOptions(options);
  }, [props.data]);

  return (
    <>
      {Object.keys(data).length !== 0 && Object.keys(props.data).length !== 0 && (
        <div className="canvas-graph">
          <Line data={data} options={options} />
        </div>
      )}
    </>
  );
}

export default LinePsifosGraph;
