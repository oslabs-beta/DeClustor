import React , { useMemo, useState , useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { themeSettings } from "../theme";
import { fetchMetrics } from '../state/api.js'
import { connectWebSocketToLineChart } from '../webService/connectWebSocketToLineChart.js'; 
// import { mockLineData as initialData } from "../data/mockData";

// ฟังก์ชันเพื่อแปลงข้อมูลดิบให้เป็นข้อมูลที่สามารถใช้กับ Nivo Line Chart
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
            })).filter(point => point.y >= 0) // กรองค่า y ที่น้อยกว่า 0
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

const LineChart = ({  userId, serviceName, metricNames }) => {
    // if (!data) {
    //     console.log("Using fallback data because prop 'data' is undefined");
    //     data = initialData;
    // }

    // console.log('data -->' , data); // Check what data is now
    const theme = useTheme();
    // const colors = themeSettings(theme.palette.mode);
    // dta state management with array of data
    const [ data , setData ] = useState([]);
    // loading state during waiting for the load
    const [ loading , setLoading ] = useState(true);
    // state of error // nulll
    const [ error , setError ] = useState(null);

    // call the function connectWebSocket 
    // then setData with the tranformed raw data
    useEffect(() => {
        const ws = connectWebSocketToLineChart(
            userId,
            serviceName,
            metricNames,
            (rawData) => {
                console.log('hi from line chart im received rawData -->', rawData);
                const transformedData = transformData(rawData);
                setData(transformedData);
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            },
            () => {
                console.log('WebSocket from Line closed');
            }
        );
        // Cleanup WebSocket connection when component unmounts
        return () => {
            ws.close();
        };
    }, [userId, serviceName, metricNames]);
    
    console.log('Line Data: [userId, serviceName, metricNames] --> ' , [userId, serviceName, metricNames])

    // loading
    if (loading) {
        return <div>Loading...</div>;
    }
    // error
    if (error) {
        return <div>Error: {error}</div>;
    }

    // make a custom theme
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
                background: theme.palette.secondary[400],  // พื้นหลังของ tooltip
                color: theme.palette.text.primary,  // สีของตัวหนังสือใน tooltip
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
                    format: '%Y-%m-%dT%H:%M:%S.%LZ',  // expects date objects
                    precision: 'minute'
                }}
                xFormat="time:%Y-%m-%d %H:%M:%S"  // formats the tooltip date display
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
                    format: "%H:%M",  // Formats the axis tick labels
                    tickValues: 'every 1 hour', // Show tick every hour
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Time',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    format: d => `${d}`,  // number in Y 
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
