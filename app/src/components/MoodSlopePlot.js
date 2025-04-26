import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Svg, Line, Text as SvgText, G } from "react-native-svg";
import { sampleData, moodIcons } from "../data/appData";
import { colors, spacing } from "../constants";

const MoodSlopePlot = ({ onDataPress }) => {
  // Get March data from sampleData (should be a full month)
  const chartData = sampleData.filter((day) => day.date.startsWith("2025-03"));

  // Order by date, earliest first (beginning to end of month)
  const sortedData = [...chartData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Chart dimensions
  const dayWidth = 40; // Width allocated for each day
  const chartWidth = Math.max(350, dayWidth * sortedData.length); // Dynamic width based on number of days
  const chartHeight = 250;
  const paddingLeft = 30;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  // Available plotting area
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Chart Y axis goes from 0-4 (mood scores)
  const moodToY = (moodValue) => {
    // Invert Y because SVG coordinates increase downward
    return paddingTop + plotHeight - (moodValue / 4) * plotHeight;
  };

  // Get mood emoji from index (mood values are 0-4, but moodIcons uses id 1-5)
  const getMoodEmoji = (moodValue) => {
    // Find the icon based on id = moodValue + 1
    return moodIcons.find((mood) => mood.id === moodValue + 1).emoji;
  };

  // Get color for a specific mood level
  const getMoodColor = (moodValue) => {
    return moodIcons.find((mood) => mood.id === moodValue + 1).color;
  };

  // Format date as day/month
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}`;
  };

  // Group mood trends for stats
  const moodTrends = sortedData.reduce(
    (acc, day) => {
      const morningMood = day.moods[0];
      const eveningMood = day.moods[1];

      if (eveningMood > morningMood) {
        acc.improved++;
      } else if (eveningMood < morningMood) {
        acc.declined++;
      } else {
        acc.unchanged++;
      }
      return acc;
    },
    { improved: 0, declined: 0, unchanged: 0 }
  );

  return (
    <View style={styles.container}>
      {/* Month heading and stats */}
      <View style={styles.headerContainer}>
        <Text style={styles.monthTitle}>March 2025</Text>
        <View style={styles.statsContainer}>
          <Text style={[styles.statText, { color: colors.mood.great }]}>
            Improved: {moodTrends.improved}
          </Text>
          <Text style={[styles.statText, { color: colors.mood.awful }]}>
            Declined: {moodTrends.declined}
          </Text>
          <Text style={[styles.statText, { color: colors.mood.neutral }]}>
            Stable: {moodTrends.unchanged}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.chartScrollContainer}
      >
        <View style={{ position: "relative" }}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Horizontal grid lines with emoji labels */}
            {[0, 1, 2, 3, 4].map((moodValue) => (
              <G key={`grid-${moodValue}`}>
                <Line
                  x1={paddingLeft - 5}
                  y1={moodToY(moodValue)}
                  x2={chartWidth - paddingRight}
                  y2={moodToY(moodValue)}
                  stroke={colors.border.light}
                  strokeWidth={1}
                  strokeDasharray="3,3"
                />
                <SvgText
                  x={paddingLeft - 15}
                  y={moodToY(moodValue) + 4}
                  fontSize={12}
                  textAnchor="end"
                  fill={getMoodColor(moodValue)}
                >
                  {getMoodEmoji(moodValue)}
                </SvgText>
              </G>
            ))}

            {/* Vertical lines for each day showing mood change */}
            {sortedData.map((day, index) => {
              const morningMood = day.moods[0];
              const eveningMood = day.moods[1];
              const morningY = moodToY(morningMood);
              const eveningY = moodToY(eveningMood);
              const xPosition = paddingLeft + index * dayWidth + dayWidth / 2;
              const moodChanged = morningMood !== eveningMood;

              // Line color based on the direction of mood change
              const lineColor =
                eveningMood > morningMood
                  ? colors.mood.great
                  : eveningMood < morningMood
                  ? colors.mood.awful
                  : colors.mood.neutral;

              // Line thickness based on magnitude of change
              const strokeWidth = moodChanged
                ? 2 + Math.abs(eveningMood - morningMood)
                : 2;

              // Find the lowest y-position to draw vertical dashed line from
              const lowestY = Math.max(morningY, eveningY);

              return (
                <G key={`day-${index}`}>
                  {/* Vertical dashed line from x-axis to mood data */}
                  <Line
                    x1={xPosition}
                    y1={chartHeight - paddingBottom}
                    x2={xPosition}
                    y2={lowestY}
                    stroke={colors.border.light}
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />

                  {/* Vertical line showing mood change (only if mood changed) */}
                  {moodChanged && (
                    <Line
                      x1={xPosition}
                      y1={morningY}
                      x2={xPosition}
                      y2={eveningY}
                      stroke={lineColor}
                      strokeWidth={strokeWidth}
                    />
                  )}

                  {/* Show either one emoji for unchanged mood or both for changed mood */}
                  {moodChanged ? (
                    <>
                      {/* Evening mood emoji at bottom of line */}
                      <SvgText
                        x={xPosition}
                        y={eveningY}
                        fontSize={16}
                        textAnchor="middle"
                      >
                        {getMoodEmoji(eveningMood)}
                      </SvgText>

                      {/* Morning mood emoji at top of line */}
                      <SvgText
                        x={xPosition}
                        y={morningY}
                        fontSize={16}
                        textAnchor="middle"
                      >
                        {getMoodEmoji(morningMood)}
                      </SvgText>
                    </>
                  ) : (
                    /* Single emoji for unchanged mood */
                    <SvgText
                      x={xPosition}
                      y={morningY}
                      fontSize={16}
                      textAnchor="middle"
                    >
                      {getMoodEmoji(morningMood)}
                    </SvgText>
                  )}

                  {/* Date label below each column */}
                  <SvgText
                    x={xPosition}
                    y={chartHeight - 10}
                    fontSize={10}
                    fill={colors.text.secondary}
                    textAnchor="middle"
                  >
                    {formatDate(day.date)}
                  </SvgText>
                </G>
              );
            })}
          </Svg>

          {/* Invisible touch areas for interactivity */}
          {sortedData.map((day, index) => {
            const xPosition = paddingLeft + index * dayWidth;

            return (
              <TouchableOpacity
                key={`touch-${index}`}
                style={[
                  styles.touchArea,
                  {
                    top: paddingTop,
                    left: xPosition,
                    width: dayWidth,
                    height: plotHeight,
                  },
                ]}
                onPress={() => onDataPress(day)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: colors.mood.great }]}
          />
          <Text style={styles.legendText}>Mood improved</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: colors.mood.awful }]}
          />
          <Text style={styles.legendText}>Mood declined</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
    marginHorizontal: 5,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  touchArea: {
    position: "absolute",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  chartScrollContainer: {
    paddingHorizontal: 10,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 10,
    paddingHorizontal: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: colors.text.secondary,
  },
});

export default MoodSlopePlot;
