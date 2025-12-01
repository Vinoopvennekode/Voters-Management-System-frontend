import "./chart/ChartSetup";   // <-- MUST BE FIRST

// Import all chart components
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from "react-chartjs-2";

const UniversalChart = ({
    type,
    data,
    options = {},
    height = 300,
}: any) => {

    const chartMap: any = {
        bar: Bar,
        line: Line,
        pie: Pie,
        doughnut: Doughnut,
        radar: Radar,
        polar: PolarArea,
        scatter: Scatter,
        bubble: Bubble,
    };

    const ChartComponent = chartMap[type];

    if (!ChartComponent) {
        return <p style={{ color: "red" }}>Invalid chart type: {type}</p>;
    }

    return (
        <div style={{ height }}>
            <ChartComponent data={data} options={options} />
        </div>
    );
};

export default UniversalChart;
