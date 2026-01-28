import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useScores } from '../../context/ScoreContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart() {
  const { globalScore, idt, idtLevel } = useScores();

  const data = {
    labels: ['Résilience', 'Dépendance'],
    datasets: [
      {
        data: [globalScore, idt],
        backgroundColor: ['#28a745', idtLevel.color],
        borderColor: ['#fff', '#fff'],
        borderWidth: 3,
        cutout: '70%'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toFixed(1)}%`
        }
      }
    }
  };

  return (
    <div className="chart-container doughnut-chart">
      <h3>Répartition Résilience / Dépendance</h3>
      <div style={{ height: '300px', width: '100%', position: 'relative' }}>
        <Doughnut data={data} options={options} />
        <div className="doughnut-center">
          <div className="idt-label">IDT</div>
          <div className="idt-value" style={{ color: idtLevel.color }}>
            {idt.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}
