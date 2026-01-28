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

export default function KPIBarChart() {
  const { kpiScores } = useScores();

  const getColorForScore = (score) => {
    if (score === null) return '#ccc';
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#17a2b8';
    if (score >= 40) return '#ffc107';
    if (score >= 20) return '#fd7e14';
    return '#dc3545';
  };

  const data = {
    labels: kpiScores.map(k => k.id),
    datasets: [
      {
        label: 'Score KPI (%)',
        data: kpiScores.map(k => k.score ?? 0),
        backgroundColor: kpiScores.map(k => getColorForScore(k.score)),
        borderColor: kpiScores.map(k => getColorForScore(k.score)),
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 40
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const kpi = kpiScores[context[0].dataIndex];
            return kpi.title;
          },
          label: (context) => {
            const kpi = kpiScores[context.dataIndex];
            return kpi.score !== null
              ? `Score: ${kpi.score.toFixed(1)}%`
              : 'Non renseigné';
          },
          afterLabel: (context) => {
            const kpi = kpiScores[context.dataIndex];
            return `Réponses: ${kpi.answeredCount}/${kpi.totalQuestions}`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value, context) => {
          const kpi = kpiScores[context.dataIndex];
          return kpi.score !== null ? `${value.toFixed(0)}%` : 'N/A';
        },
        font: {
          weight: 'bold',
          size: 11
        },
        color: '#333'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: (value) => `${value}%`
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '600'
          }
        }
      }
    }
  };

  return (
    <div className="chart-container kpi-bar-chart">
      <h3>Performance des Indicateurs Clés (KPI)</h3>
      <div style={{ height: '300px', width: '100%' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
