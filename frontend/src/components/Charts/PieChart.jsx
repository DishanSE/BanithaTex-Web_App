import React from 'react';
import { PieChart as RePieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const PieChart = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57', '#FFC658'];

    return (
        <RePieChart width={400} height={300}>
            <Pie 
                data={data} 
                dataKey="value" 
                nameKey="label" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                fill="#8884d8" 
                label
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </RePieChart>
    );
};

export default PieChart;