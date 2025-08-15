// components/dashboard/MonthlyChart.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyChart = ({ data }) => {
  const chartData = [
    {
      name: 'Income',
      fees: data?.financialSummary?.totalFees || 0,
      matchIncome: data?.financialSummary?.totalMatchIncome || 0,
      total: (data?.financialSummary?.totalFees || 0) + (data?.financialSummary?.totalMatchIncome || 0)
    },
    {
      name: 'Expenses',
      amount: data?.financialSummary?.totalExpenditure || 0
    },
    {
      name: 'Net',
      amount: ((data?.financialSummary?.totalFees || 0) + (data?.financialSummary?.totalMatchIncome || 0)) - 
             (data?.financialSummary?.totalExpenditure || 0)
    }
  ];

  return (
    <Box sx={{ height: 400, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString()}`, '']}
            labelFormatter={(label) => <strong>{label}</strong>}
          />
          <Legend />
          <Bar dataKey="fees" name="Fee Income" fill="#8884d8" />
          <Bar dataKey="matchIncome" name="Match Income" fill="#82ca9d" />
          <Bar dataKey="amount" name="Expenses/Net" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
      {data?.metadata && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          Financial overview for {data.metadata.month} {data.metadata.year}
        </Typography>
      )}
    </Box>
  );
};

export default MonthlyChart;