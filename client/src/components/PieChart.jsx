import React, { useState , useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from "@mui/material";
import { connectWebSocketToPieChart } from '../webService/connectWebSocketToPieChart.js';
import { useSelector } from 'react-redux';

// Function to transform raw data to pie chart format
const transformData = (rawData) => {
    if (!rawData || typeof rawData !== 'object') {
        console.log('Expected rawData in the Pie Chart components to be an object, but got', rawData);
        return [];
    }

    const { totalTasks, runningTasks, pendingTasks, stoppedTasks } = rawData;

    // Transform data to Nivo Pie Chart format
    const transformedData = [
        { id: 'TotalTasks', label: 'Total Tasks', value: totalTasks },
        { id: 'RunningTasks', label: 'Running Tasks', value: runningTasks },
        { id: 'PendingTasks', label: 'Pending Tasks', value: pendingTasks },
        { id: 'StoppedTasks', label: 'Stopped Tasks', value: stoppedTasks },
    ];
    return transformedData;
};

const PieChart = () => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector((state) => state.user.userId);
    const serviceName = useSelector((state) => state.user.serviceName);

    // custom tooltip for pie chart
    const CustomTooltip = ({ datum }) => (
        <div
            style={{
                padding: '5px 10px',
                background: theme.palette.secondary[400],
                borderRadius: '3px',
            }}
        >
            <strong>{datum.label}</strong>: {datum.value}
        </div>
    );

    useEffect(() => {
        if (userId && serviceName) {
            // Connect to WebSocket using userId and serviceName
            const ws = connectWebSocketToPieChart(userId, serviceName, (rawData) => {
                const transformedData = transformData(rawData);
                setData(transformedData);
                setLoading(false);
            },
                (error) => {
                    setError(error.message);
                    setLoading(false);
                },
                () => {
                    console.log('WebSocket from Pie closed');
                }
            );

            // Cleanup WebSocket on component unmount
            return () => {
                ws.close();
            };
        }
    }, [userId, serviceName]);

    // Loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ height: "400px", width: "100%" }}>
        <ResponsivePie
            // the data to be displayed in the pie chart
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            // radius for the innder circle(create a donut chart)
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={theme.palette.text.primary}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
            }}
            tooltip={CustomTooltip}           
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 20,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: theme.palette.text.secondary,
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: theme.palette.text.primary
                            }
                        }
                    ]
                }
            ]}
        />
        </div>
    );
};

export default PieChart;
