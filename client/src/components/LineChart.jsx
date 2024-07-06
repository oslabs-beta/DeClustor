import React , { useMemo, useState , useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { themeSettings } from "../theme";
import { fetchMetrics } from '../state/api.js'
import { connectWebSocket } from '../webService/websocketService.js'; 
// import { mockLineData as initialData } from "../data/mockData";

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
    
    //app.get('/listAllService', listController.Service);
    useEffect(() => {
        const ws = connectWebSocket(
            userId,
            serviceName,
            metricNames,
            (data) => {
                setData(data);
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            },
            () => {
                console.log('WebSocket closed');
            }
        );

        // Cleanup WebSocket connection when component unmounts
        return () => {
            ws.close();
        };
    }, [userId, serviceName, metricNames]);

    console.log('[userId, serviceName, metricNames] --> ' , [userId, serviceName, metricNames])
    // loading
    if (loading) {
        return <div>Loading...</div>
    };
    // error
    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div style={{ height: "400px", width: "100%" }}>
            
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{
                    type: 'time',
                    format: 'native',  // Expects Date objects
                }}
                xFormat="time:%Y-%m-%d"  // Formats the tooltip date display
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    format: "%Y-%m-%d",  // Formats the axis tick labels
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Date',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Value',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
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