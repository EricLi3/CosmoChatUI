import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const data = [
  { name: 'Mon', messages: 40 },
  { name: 'Tue', messages: 30 },
  { name: 'Wed', messages: 20 },
  { name: 'Thu', messages: 27 },
  { name: 'Fri', messages: 18 },
  { name: 'Sat', messages: 23 },
  { name: 'Sun', messages: 34 },
];

const ActivityDashboard = () => {// makes the frames we see
  return (
    <Paper elevation={3} sx={{ padding: 2}}>    
      <Typography variant="h6" gutterBottom> 
        Weekly Chat Activity
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 10, right: 30, left: 20, bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="messages" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ActivityDashboard;
