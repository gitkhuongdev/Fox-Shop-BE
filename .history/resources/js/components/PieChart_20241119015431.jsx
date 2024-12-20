import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
function PieChart() {
    return (
        <Bar
            data={{
                labels: [
                    "Africa",
                    "Asia",
                    "Europe",
                    "Latin America",
                    "North America",
                ],
                datasets: [
                    {
                        label: "Population (millions)",
                        backgroundColor: [
                            "#3e95cd",
                            "#8e5ea2",
                            "#3cba9f",
                            "#e8c3b9",
                            "#c45850",
                        ],
                        data: [2478, 5267, 734, 784, 433],
                    },
                ],
            }}
            options={{
                plugins: {
                    legend: {
                        display: false, // Ẩn legend
                    },
                    title: {
                        display: true,
                        text: "Thống kê dữ liệu sản phẩm",
                    },
                },
                responsive: true,
                scales: {
                    x: {
                        type: "category", // Sử dụng scale 'category' cho trục x
                    },
                    y: {
                        type: "linear", // Sử dụng scale 'linear' cho trục y
                        beginAtZero: true,
                    },
                },
            }}
        />
    );
}

export default PieChart;
