import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueChart = ({ data }) => {
  // Check if data exists and is an array
  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  const dates = data.map(item => item.date);
  const revenues = data.map(item => item.revenue);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Doanh thu',
        data: revenues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h3>Biểu đồ Doanh thu theo ngày</h3>
      <Line data={chartData} />
    </div>
  );
};

export default RevenueChart;
