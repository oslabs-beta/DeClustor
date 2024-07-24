import React , { useMemo, useState , useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { connectWebSocketToLineChart } from '../webService/connectWebSocketToLineChart.js'; 
import { useSelector } from "react-redux";

/**
 * Transforms raw data for use in the Nivo line chart.
 * @param {Array} rawData - The raw data array to be transformed.
 * @returns {Array} - The transformed data array.
 */
const transformData = (rawData) => {
    // Check if rawData is an array
    if (!Array.isArray(rawData)) {
        return [];
    }

    // Transform the raw data into the format required by the Nivo line chart
    const transformedData = [
        {
            id: 'Average',
            data: rawData.map(point => ({
                x: point.Timestamp, // Map Timestamp to x-axis
                y: point.Average // Map Average to y-axis
            })).filter(point => point.y >= 0) // Filter out points with negative y values
        },
        {
            id: 'Minimum',
            data: rawData.map(point => ({
                x: point.Timestamp, // Map Timestamp to x-axis
                y: point.Minimum // Map Minimum to y-axis
            })).filter(point => point.y >= 0)
        },
        {
            id: 'Maximum',
            data: rawData.map(point => ({
                x: point.Timestamp, // Map Timestamp to x-axis
                y: point.Maximum // Map Maximum to y-axis
            })).filter(point => point.y >= 0)
        }
    ];
    return transformedData;
};

// LineChart component
const LineChart = ({ metricNames }) => {
    const theme = useTheme(); 
    // State variables to manage the data fetching and WebSocket connection process:
    // - 'data' stores the transformed data for the line chart.
    // - 'loading' tracks the loading status of the data fetching process.
    // - 'error' tracks any errors that occur during data fetching or WebSocket connection.
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    // Get userId and serviceName from Redux store
    const { userId, accountName, region, clusterName, serviceName } = useSelector((state) => ({
        userId: state.user.userId,
        accountName: state.user.accountName,
        region: state.user.region,
        clusterName: state.user.clusterName,
        serviceName: state.user.serviceName,
      })); 

    // useEffect to connect to WebSocket and fetch data
    useEffect(() => {
        // Check if userId or serviceName is undefined
        if (!userId || !accountName || !region || !clusterName || !serviceName) {
            console.error("userId or serviceName is undefined");
            // Set loading to false since we cannot proceed
            setLoading(false);
            return;
        }

        // Connect to the WebSocket for fetching line chart data
        const ws = connectWebSocketToLineChart(
            userId,
            accountName,
            region,
            clusterName,
            serviceName,
            metricNames,
            (rawData) => {
                const transformedData = transformData(rawData);
                setData(transformedData);
                // Set loading to false as data fetching is complete
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
        
        // Cleanup function to close the WebSocket connection when the component unmounts or dependencies change
        return () => {
            ws.close();
        };
    }, [userId, accountName, region, clusterName, serviceName, metricNames]); // Dependencies array: re-run the effect when userId, serviceName, or metricNames change

    // Handle case where userId or serviceName is not defined
    if (!userId || !serviceName) {
        return <div>Please select a service to view the metrics.</div>;
    }

    // Handle loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Custom theme for Nivo chart
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
                // data display on line chart
                data={data}
                theme={customTheme}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                // configuration for the x-asis scale
                xScale={{
                    type: 'time',
                    format: '%Y-%m-%dT%H:%M:%S.%LZ',
                    precision: 'minute'
                }}
                // format for displaying x-axis values
                xFormat="time:%Y-%m-%d %H:%M:%S"
                // configuration for the y-axis scale
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                    reverse: false
                }}
                // configuration for the top axis
                axisTop={null}
                // configuration for the right axis
                axisRight={null}
                // configuration for the bottom axis
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
                // configuration for the left axis
                axisLeft={{
                    format: d => `${d}`,
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Percent',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                // point setting: size, color, border width, border color
                pointSize={6}
                pointColor={{ from: 'color', modifiers: [] }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                // Enable slices for the x-axis
                enableSlices="x"
                // Use mesh for interaction
                useMesh={true}
                // configuration for the lengends
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