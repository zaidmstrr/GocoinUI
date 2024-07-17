import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HomeLineChart = ({ chartType, isAvgChecked, isOrdChecked }) => {
  const [chartData, setChartData] = useState([]);
  const [cs, setCs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/blocks.json');
        const data = response.data;
        const filteredData = data.filter(item => item.TxCnt !== 1);
        setCs(filteredData);
        const transformedData = processChartData(filteredData);
        setChartData(transformedData);
      } catch (error) {
        setTimeout(fetchData, 1000); // Retry after 1 second on error
      }
    };

    fetchData();
  }, [chartType, isAvgChecked, isOrdChecked]);

  const processChartData = (data) => {
    const plotData = data.map((item, index) => {
      if (isAvgChecked) {
        let sum = 0, avgcnt = 0, sumord = 0;
        for (let ii = index; avgcnt < 6 && ii >= 0; ii--) {
          if (data[ii].TxCnt === 1) continue;
          avgcnt++;
          if (chartType === 'blockKB') {
            sum += data[ii].Size / 1000.0;
            sumord += data[ii].OrdSize / 1000.0;
          } else if (chartType === 'SPB') {
            sum += data[ii].FeeSPB;
          } else if (chartType === 'Weight') {
            sum += data[ii].Weight;
            sumord += data[ii].OrdWeight;
          } else {
            sum += data[ii].TxCnt;
            sumord += data[ii].OrdCnt;
          }
        }
        if (avgcnt > 0) {
          return {
            x: item.Timestamp * 1000,
            y: chartType === 'SPB' || !isOrdChecked ? sum / avgcnt : 100 * sumord / sum
          };
        }
      } else {
        if (chartType === 'blockKB') {
          return {
            x: item.Timestamp * 1000,
            y: isOrdChecked ? 100 * item.OrdSize / item.Size : item.Size / 1000.0
          };
        } else if (chartType === 'SPB') {
          return { x: item.Timestamp * 1000, y: item.FeeSPB };
        } else if (chartType === 'Weight') {
          return {
            x: item.Timestamp * 1000,
            y: isOrdChecked ? 100 * item.OrdWeight / item.Weight : item.Weight
          };
        } else {
          return {
            x: item.Timestamp * 1000,
            y: isOrdChecked ? 100 * item.OrdCnt / item.TxCnt : item.TxCnt
          };
        }
      }
      return null; // Ensure map function returns something
    }).filter(item => item !== null); // Filter out null items

    return plotData;
  };

  const tim2str = (timestamp, detailed = false) => {
    const date = new Date(timestamp * 1000);
    return detailed ? date.toLocaleString() : date.toLocaleTimeString();
  };

  const val2str = (value) => {
    return value.toFixed(8);
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'PPpp',
          displayFormats: {
            minute: 'HH:mm'
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
        min: 0,
        max: isOrdChecked ? 100 : undefined,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const rec = cs[context.dataIndex];
            let lines = [];
            lines.push('Block #' + rec.Height + ', Version 0x' + rec.Version.toString(16));
            lines.push(tim2str(rec.Received) + ' ... ' + tim2str(rec.Timestamp, true));
            lines.push('' + rec.TxCnt + ' transactions / ' + rec.Size + ' bytes');
            lines.push(val2str(rec.Reward) + ' BTC / ' + rec.FeeSPB.toFixed(2) + ' SPB');
            lines.push('Block Weight: ' + rec.Weight);
            lines.push('Mined by ' + rec.Miner);
            lines.push('Ords use ' + (100 * rec.OrdCnt / rec.TxCnt).toFixed(0) + '% txs, ' +
              (100 * rec.OrdSize / rec.Size).toFixed(0) + '% size, ' +
              (100 * rec.OrdWeight / rec.Weight).toFixed(0) + '% of weight');
            return lines;
          }
        }
      }
    }
  };

  const chartDataFormatted = {
    datasets: [
      {
        label: "Blocks",
        data: chartData,
        maintainAspectRatio: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(117, 200, 209, 0.2)",
        fill: true
      },
    ],
  };

  return (
    <div>
      <Line options={chartOptions} data={chartDataFormatted} width={"40%"} height={"8%"} />
    </div>
  );
}

export default HomeLineChart;
