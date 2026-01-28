import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip
} from 'chart.js';
import { useScores } from '../../context/ScoreContext';

ChartJS.register(ArcElement, Tooltip);

export default function GaugeChart() {
  const { idt, idtLevel } = useScores();

  // Create gauge segments
  const segments = [
    { max: 20, color: '#28a745', label: 'Très faible' },
    { max: 40, color: '#ffc107', label: 'Faible' },
    { max: 60, color: '#fd7e14', label: 'Modérée' },
    { max: 80, color: '#dc3545', label: 'Forte' },
    { max: 100, color: '#721c24', label: 'Très forte' }
  ];

  const data = {
    datasets: [
      {
        data: [20, 20, 20, 20, 20, 100],
        backgroundColor: [
          '#28a745',
          '#ffc107',
          '#fd7e14',
          '#dc3545',
          '#721c24',
          'transparent'
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: '75%'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  // Calculate needle position (0-180 degrees for 0-100 IDT)
  const needleAngle = (idt / 100) * 180 - 90;

  return (
    <div className="chart-container gauge-chart">
      <h3>Jauge IDT - Indice de Dépendance Technologique</h3>
      <div style={{ height: '220px', width: '100%', position: 'relative' }}>
        <Doughnut data={data} options={options} />

        {/* Needle */}
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${needleAngle}deg)` }}
        >
          <div className="needle-line"></div>
          <div className="needle-center"></div>
        </div>

        {/* Value Display */}
        <div className="gauge-value">
          <div className="gauge-idt-value" style={{ color: idtLevel.color }}>
            {idt.toFixed(1)}
          </div>
          <div className="gauge-idt-label">{idtLevel.level}</div>
          <div className="gauge-idt-desc">{idtLevel.description}</div>
        </div>

        {/* Scale Labels */}
        <div className="gauge-labels">
          <span className="gauge-label left">0</span>
          <span className="gauge-label center">50</span>
          <span className="gauge-label right">100</span>
        </div>
      </div>
    </div>
  );
}
