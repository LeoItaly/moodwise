import React from "react";
import { LineChart } from "react-native-gifted-charts";
import { sampleData } from "../data/appData";

const MoodLineChart = ({ onDataPress }) => {
  // Days of week for x-axis labels
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Process data for line chart (mood over time)
  const moodOverTimeData = sampleData.slice(0, 7).map((item, index) => {
    const avgMood = (item.moods[0] + item.moods[1]) / 2;
    return {
      value: avgMood,
      label: daysOfWeek[index],
      dataPointText: avgMood.toFixed(1),
      date: item.date,
      morningMood: item.moods[0],
      eveningMood: item.moods[1],
    };
  });

  return (
    <LineChart
      data={moodOverTimeData}
      height={250}
      spacing={40}
      initialSpacing={20}
      color="#3b82f6"
      thickness={3}
      startFillColor="#3b82f6"
      endFillColor="#60a5fa"
      startOpacity={0.9}
      endOpacity={0.2}
      backgroundColor="transparent"
      xAxisColor="#94a3b8"
      yAxisColor="#94a3b8"
      yAxisTextStyle={{ color: "#64748b", fontWeight: "500" }}
      xAxisLabelTextStyle={{ color: "#64748b", fontWeight: "500" }}
      hideRules
      minValue={0}
      maxValue={4}
      stepValue={1}
      onPress={onDataPress}
    />
  );
};

export default MoodLineChart;
