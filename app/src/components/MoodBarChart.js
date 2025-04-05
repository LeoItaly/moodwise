import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { sampleData, activities, weather } from "../data/appData";

const MoodBarChart = ({ filterType, onDataPress }) => {
  // Activity icons mapping
  const activityIcons = {
    Football: "⚽",
    Gymnastics: "🤸",
    Swimming: "🏊",
    Gym: "🏋️",
    Walking: "🚶",
    Badminton: "🏸",
    Handball: "🤾",
    Tennis: "🎾",
    Running: "🏃",
    Others: "🏋️‍♂️",
  };

  // Weather icons mapping
  const weatherIcons = {
    Sunny: "☀️",
    Cloudy: "☁️",
    Windy: "💨",
    Rainy: "🌧️",
    Snowy: "❄️",
  };

  // Process data for bar chart based on selected filter
  const getBarChartData = () => {
    if (filterType === "Activity") {
      return activities.map((activity) => {
        const activityDays = sampleData.filter((day) =>
          day.activities.includes(activity.label)
        );
        const avgMood =
          activityDays.length > 0
            ? activityDays.reduce((sum, day) => {
                return sum + (day.moods[0] + day.moods[1]) / 2;
              }, 0) / activityDays.length
            : 0;

        const color =
          avgMood < 1 ? "#ef4444" : avgMood < 3 ? "#facc15" : "#22c55e";

        return {
          value: avgMood,
          label: activityIcons[activity.label],
          dataPointText: avgMood.toFixed(1),
          count: activityDays.length,
          frontColor: color,
          type: "Activity",
          name: activity.label,
        };
      });
    } else {
      return weather.map((weatherType) => {
        const weatherDays = sampleData.filter(
          (day) => day.weather === weatherType.label
        );
        const avgMood =
          weatherDays.length > 0
            ? weatherDays.reduce((sum, day) => {
                return sum + (day.moods[0] + day.moods[1]) / 2;
              }, 0) / weatherDays.length
            : 0;

        const color =
          avgMood < 1 ? "#ef4444" : avgMood < 3 ? "#facc15" : "#22c55e";

        return {
          value: avgMood,
          label: weatherIcons[weatherType.label],
          dataPointText: avgMood.toFixed(1),
          count: weatherDays.length,
          frontColor: color,
          type: "Weather",
          name: weatherType.label,
        };
      });
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.barChartScrollContainer}
    >
      <BarChart
        data={getBarChartData()}
        height={250}
        width={600}
        spacing={40}
        initialSpacing={10}
        barWidth={30}
        noOfSections={4}
        barBorderRadius={6}
        backgroundColor="transparent"
        xAxisColor="#94a3b8"
        yAxisColor="#94a3b8"
        yAxisTextStyle={{ color: "#64748b", fontWeight: "500" }}
        xAxisLabelTextStyle={{
          color: "#64748b",
          fontSize: 12,
          fontWeight: "500",
        }}
        hideRules
        minValue={0}
        maxValue={4}
        stepValue={1}
        onPress={onDataPress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  barChartScrollContainer: {
    paddingRight: 20,
  },
});

export default MoodBarChart;
