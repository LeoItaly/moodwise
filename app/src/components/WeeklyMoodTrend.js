import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import {
  Svg,
  Path,
  Line,
  Text as SvgText,
  Circle,
  G,
  Rect,
} from "react-native-svg";
import { sampleData, moodIcons } from "../data/appData";
import { colors, spacing } from "../constants";

const WeeklyMoodTrend = ({ onDataPress }) => {
  const [activePoint, setActivePoint] = useState(null);
  const [hoverPoint, setHoverPoint] = useState(null);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create a pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Get the last 7 days of data from the sample data
  const getLastSevenDays = () => {
    // Sort by date, latest first
    const sortedData = [...sampleData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Take first 7 entries
    return sortedData.slice(0, 7).reverse();
  };

  const weekData = getLastSevenDays();

  // Chart dimensions
  const chartWidth = Dimensions.get("window").width - 60; // Adjust for padding
  const chartHeight = 250;
  const paddingLeft = 30;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  // Available plotting area
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // X-axis interval for 7 days
  const xInterval = plotWidth / 6; // 6 intervals for 7 data points

  // Chart Y axis goes from 0-4 (mood scores)
  const moodToY = (moodValue) => {
    // Invert Y because SVG coordinates increase downward
    return paddingTop + plotHeight - (moodValue / 4) * plotHeight;
  };

  // Get day of week and date as DD/MM
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    return { dayOfWeek, formatted: `${day}/${month}` };
  };

  // Calculate average mood for each day (morning + evening / 2)
  const getDayAverageMood = (day) => {
    return (day.moods[0] + day.moods[1]) / 2;
  };

  // Get mood emoji from index
  const getMoodEmoji = (moodValue) => {
    // Round to nearest integer for emoji lookup
    const roundedMood = Math.round(moodValue);

    // Validate mood value range and provide fallback
    if (roundedMood < 0 || roundedMood > 4) {
      return "😐"; // Default fallback emoji
    }

    // Find the icon based on id = moodValue + 1
    const moodIcon = moodIcons.find((mood) => mood.id === roundedMood + 1);
    return moodIcon ? moodIcon.emoji : "😐";
  };

  // Get color for a specific mood level
  const getMoodColor = (moodValue) => {
    const roundedMood = Math.round(moodValue);
    // Check if rounded mood is valid (0-4) and provide fallback if not found
    if (roundedMood < 0 || roundedMood > 4) {
      return colors.text.secondary; // Default fallback color
    }

    const moodIcon = moodIcons.find((mood) => mood.id === roundedMood + 1);
    return moodIcon ? moodIcon.color : colors.text.secondary;
  };

  // Get mood label from value
  const getMoodLabel = (moodValue) => {
    const labels = ["Awful", "Bad", "Neutral", "Good", "Radiant"];
    const roundedMood = Math.round(moodValue);

    // Check if mood index is valid
    if (roundedMood < 0 || roundedMood >= labels.length) {
      return "Neutral"; // Default fallback label
    }

    return labels[roundedMood];
  };

  // Create line path for the trend
  const createLinePath = () => {
    if (weekData.length === 0) return "";

    let path = "";
    weekData.forEach((day, index) => {
      const avgMood = getDayAverageMood(day);
      const x = paddingLeft + index * xInterval;
      const y = moodToY(avgMood);

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Last 7 Days Mood Trend</Text>
        <Text style={styles.headerSubtitle}>Daily average mood</Text>
      </View>

      <View style={styles.chartContainer}>
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

          {/* Line chart path */}
          <Path
            d={createLinePath()}
            stroke={colors.brand.primary}
            strokeWidth={3}
            fill="none"
          />

          {/* Data points */}
          {weekData.map((day, index) => {
            const avgMood = getDayAverageMood(day);
            const x = paddingLeft + index * xInterval;
            const y = moodToY(avgMood);
            const isActive = activePoint === index || hoverPoint === index;

            return (
              <G key={`point-${index}`}>
                {/* Point circle */}
                <Circle
                  cx={x}
                  cy={y}
                  r={isActive ? 8 : 6}
                  fill={isActive ? getMoodColor(avgMood) : colors.white}
                  stroke={getMoodColor(avgMood)}
                  strokeWidth={2}
                />

                {/* Indicator ring to show it's interactive */}
                <Circle
                  cx={x}
                  cy={y}
                  r={10}
                  fill="transparent"
                  stroke={getMoodColor(avgMood)}
                  strokeWidth={1}
                  strokeDasharray="2,2"
                  opacity={isActive ? 1 : 0.6}
                />

                {/* Tooltip when hovering/active */}
                {isActive && (
                  <G>
                    <Rect
                      x={x - 40}
                      y={y - 45}
                      width={80}
                      height={35}
                      rx={5}
                      fill={colors.white}
                      stroke={colors.border.light}
                    />
                    <SvgText
                      x={x}
                      y={y - 30}
                      fontSize={12}
                      fontWeight="bold"
                      textAnchor="middle"
                      fill={getMoodColor(avgMood)}
                    >
                      {getMoodLabel(avgMood)}
                    </SvgText>
                    <SvgText
                      x={x}
                      y={y - 15}
                      fontSize={10}
                      textAnchor="middle"
                      fill={colors.text.secondary}
                    >
                      Click for details
                    </SvgText>
                  </G>
                )}

                {/* Day labels (showing formatted date below x-axis) */}
                <SvgText
                  x={x}
                  y={chartHeight - 20}
                  fontSize={10}
                  textAnchor="middle"
                  fill={colors.text.secondary}
                >
                  {formatDate(day.date).dayOfWeek}
                </SvgText>
                <SvgText
                  x={x}
                  y={chartHeight - 5}
                  fontSize={10}
                  textAnchor="middle"
                  fill={colors.text.secondary}
                >
                  {formatDate(day.date).formatted}
                </SvgText>
              </G>
            );
          })}
        </Svg>

        {/* Invisible touch areas for interactivity */}
        {weekData.map((day, index) => {
          const x = paddingLeft + index * xInterval - xInterval / 2;

          return (
            <TouchableOpacity
              key={`touch-${index}`}
              style={[
                styles.touchArea,
                {
                  left: x,
                  width: xInterval,
                  height: plotHeight,
                  top: paddingTop,
                },
              ]}
              onPress={() => {
                // Add average mood property to the day data for the modal
                const dayWithAvg = {
                  ...day,
                  averageMood: getDayAverageMood(day),
                };
                setActivePoint(index);
                onDataPress(dayWithAvg);
              }}
              onPressIn={() => setActivePoint(index)}
              onPressOut={() => setActivePoint(null)}
              onMouseEnter={() => setHoverPoint(index)}
              onMouseLeave={() => setHoverPoint(null)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  chartContainer: {
    position: "relative",
  },
  touchArea: {
    position: "absolute",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendLine: {
    width: 20,
    height: 3,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});

export default WeeklyMoodTrend;
