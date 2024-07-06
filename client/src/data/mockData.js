const CPUUtilization = [];

const startDate = new Date("2024-07-03T21:29:00.000Z");

for (let i = 0; i < 10; i++) {
    // Create a new date for each entry
    const newDate = new Date(startDate.getTime());
    newDate.setDate(startDate.getDate() + i);

    // Generate mock data for each day
    CPUUtilization.push({
        Timestamp: newDate.toISOString(),
        Average: Math.random() * 0.01, 
        Sum: Math.random() * 0.02,    
        Minimum: 0,
        Maximum: Math.random() * 0.03,
        Unit: 'Percent'
    });
}

// export mock data (Line)
export const mockLineData = [
  {
      id: "Average",
      data: CPUUtilization.map(item => ({
          x: new Date(item.Timestamp),
          y: item.Average
      }))
  },
  {
      id: "Sum",
      data: CPUUtilization.map(item => ({
          x: new Date(item.Timestamp),
          y: item.Sum
      }))
  },
  {
      id: "Minimum",
      data: CPUUtilization.map(item => ({
          x: new Date(item.Timestamp),
          y: item.Minimum
      }))
  },
  {
      id: "Maximum",
      data: CPUUtilization.map(item => ({
          x: new Date(item.Timestamp),
          y: item.Maximum
      }))
  }
];

// export mock data (Pie)
export const mockPieData = [
    {
      id: "aria",
      label: "aria",
      value: 239,
      color: "hsl(104, 70%, 50%)",
    },
    {
      id: "ploy",
      label: "ploy",
      value: 170,
      color: "hsl(162, 70%, 50%)",
    },
    {
      id: "will",
      label: "will",
      value: 322,
      color: "hsl(291, 70%, 50%)",
    },
    {
      id: "grace",
      label: "grace",
      value: 503,
      color: "hsl(229, 70%, 50%)",
    },
    {
      id: "yay it works",
      label: "yay it works",
      value: 584,
      color: "hsl(344, 70%, 50%)",
    },
  ];