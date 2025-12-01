// ChartSetup.ts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,        // <-- REQUIRED FOR PIE / DOUGHNUT
  RadialLinearScale, // <-- REQUIRED FOR POLAR & RADAR
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ALL elements (once)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,        // <-- FIXES THE ERROR
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
);

export default ChartJS;
