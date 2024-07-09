import React , { useMemo, useState , useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { connectWebSocketToLineChart } from '../webService/connectWebSocketToLineChart.js'; 
import { useSelector } from "react-redux";
// import { themeSettings } from "../theme";
// import { fetchMetrics } from '../state/api.js'
// Function to transform raw data into a format suitable for Nivo Line Chart
const transformData = (rawData) => {
    if (!Array.isArray(rawData)) {
        console.error("Expected rawData in the Line Chart components to be an array, but got:", rawData);
        return [];
    }

    const transformedData = [
        {
            id: 'Average',
            data: rawData.map(point => ({
                x: point.Timestamp,
                y: point.Average
            })).filter(point => point.y >= 0)
        },
        {
            id: 'Minimum',
            data: rawData.map(point => ({
                x: point.Timestamp,
                y: point.Minimum
            })).filter(point => point.y >= 0)
        },
        {
            id: 'Maximum',
            data: rawData.map(point => ({
                x: point.Timestamp,
                y: point.Maximum
            })).filter(point => point.y >= 0)
        }
    ];

    console.log('Line Transformed data -->', transformedData);
    return transformedData;
};

const LineChart = ({ metricNames }) => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = useSelector((state) => state.user.userId);
    const serviceName = useSelector((state) => state.user.serviceName);

    useEffect(() => {
        if (!userId || !serviceName) {
            console.error("userId or serviceName is undefined");
            setLoading(false);
            return;
        }

        const ws = connectWebSocketToLineChart(
            userId,
            serviceName,
            metricNames,
            (rawData) => {
                console.log('Received rawData -->', rawData);
                const transformedData = transformData(rawData);
                setData(transformedData);
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            },
            () => {
                console.log('WebSocket connection closed');
            }
        );

        return () => {
            ws.close();
        };
    }, [userId, serviceName, metricNames]);

    console.log('Line Data: [userId, serviceName, metricNames] --> ', [userId, serviceName, metricNames]);

    if (!userId || !serviceName) {
        return <div>Please select a service to view the metrics.</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const customTheme = {
        axis: {
            ticks: {
                text: {
                    fill: theme.palette.text.primary,
                },
            },
            legend: {
                text: {
                    fill: theme.palette.text.primary,
                },
            },
        },
        legends: {
            text: {
                fill: theme.palette.text.primary,
            },
        },
        tooltip: {
            container: {
                background: theme.palette.secondary[400],
                color: theme.palette.text.primary,
            },
        },
    };

    return (
        <div style={{ height: "400px", width: "100%" }}>
            <ResponsiveLine
                data={data}
                theme={customTheme}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{
                    type: 'time',
                    format: '%Y-%m-%dT%H:%M:%S.%LZ',
                    precision: 'minute'
                }}
                xFormat="time:%Y-%m-%d %H:%M:%S"
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                    reverse: false
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    format: "%H:%M",
                    tickValues: 'every 1 hour',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Time',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    format: d => `${d}`,
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Percent',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={6}
                pointColor={{ from: 'color', modifiers: [] }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableSlices="x"
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
};

export default LineChart;