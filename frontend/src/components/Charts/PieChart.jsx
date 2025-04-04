import React from 'react';
import { PieChart as RePieChart, Pie, Tooltip, Legend } from 'recharts';

const PieChart = ({ data }) => {
    return (
        <RePieChart width={400} height={300}>
            <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
            <Tooltip />
            <Legend />
        </RePieChart>
    );
};

export default PieChart;