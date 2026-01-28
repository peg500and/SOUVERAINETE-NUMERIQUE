import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useScores } from '../../context/ScoreContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function BarChart() {
  const { axisScores } = useScores();

  const data = {
    labels: axisScores.map(a => a.axis),
    datasets: [
      {
        label: 'Score de résilience (%)',
        data: axisScores.map(a => a.score),
        backgroundColor: axisScores.map(a => a.color),
        borderColor: axisScores.map(a => a.color),
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 50
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Score: ${context.raw.toFixed(1)}%`
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value) => `${value.toFixed(1)}%`,
        font: {
          weight: 'bold',
          size: 12
        },
        color: '#333'
      }
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => `${value}%`
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: '600'
          }
        }
      }
    }
  };

  return (
    <div className="chart-container bar-chart">
      <h3>Score par Axe de Dépendance</h3>
      <div style={{ height: '350px', width: '100%' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
