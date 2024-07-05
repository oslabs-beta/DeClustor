import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from "@mui/material";
import { mockPieData as initialData } from "../data/mockData";

const PieChart = ({ data = initialData }) => {
    const theme = useTheme();

    return (
        <div style={{ height: "400px", width: "100%" }}>
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
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
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                { match: { id: 'ruby' }, id: 'dots' },
                { match: { id: 'c' }, id: 'dots' },
                { match: { id: 'go' }, id: 'dots' },
                { match: { id: 'python' }, id: 'dots' },
                { match: { id: 'scala' }, id: 'lines' }
            ]}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
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
