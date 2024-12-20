import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData }) {
    const data = {
        labels: ["Red", "Orange", "Blue"],
        datasets: [
            {
                label: "Popularity of colours",
                data: [55, 23, 96],
                backgroundColor: [
                    "rgba(255, 255, 255, 0.6)",
                    "rgba(255, 255, 255, 0.6)",
                    "rgba(255, 255, 255, 0.6)",
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
            <Pie
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Users Gained between 2016-2020",
                        },
                    },
                }}
            />
        </div>
    );
}
export default PieChart;
