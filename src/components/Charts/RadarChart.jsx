import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { useScores } from '../../context/ScoreContext';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart() {
  const { axisScores } = useScores();

  const data = {
    labels: axisScores.map(a => a.axis),
    datasets: [
      {
        label: 'Score de résilience (%)',
        data: axisScores.map(a => a.score),
        backgroundColor: 'rgba(68, 114, 196, 0.2)',
        borderColor: '#4472C4',
        borderWidth: 2,
        pointBackgroundColor: axisScores.map(a => a.color),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4472C4',
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#333'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toFixed(1)}%`
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          font: { size: 11 },
          backdropColor: 'transparent'
        },
        pointLabels: {
          font: { size: 12, weight: '600' },
          color: '#333'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <div className="chart-container radar-chart">
      <h3>Radar de Résilience par Axe</h3>
      <div style={{ height: '400px', width: '100%' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
