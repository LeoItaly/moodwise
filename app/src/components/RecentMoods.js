import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, borderRadius, spacing, textStyles } from "../constants";

const RecentMoods = ({ onCalendarPress, allMoodData = [] }) => {
  // Create data for the last 14 days based on today's date
  const biWeeklyData = useMemo(() => {
    const today = new Date();
    const last14Days = [];

    // Format date as YYYY-MM-DD
    const formatDateISO = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Generate dates for the last 14 days (including today)
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = formatDateISO(date);

      // Find mood data for this date if it exists
      const moodData = allMoodData.find((day) => day.date === dateString);

      last14Days.push({
        date: dateString,
        dayOfMonth: date.getDate(),
        dayOfWeek: date.getDay(),
        isToday: i === 0,
        // Use actual mood data if available, otherwise set moods to null
        moods: moodData ? moodData.moods : [null, null],
      });
    }

    return last14Days;
  }, [allMoodData]);

  const getMoodColor = (avgMood) => {
    if (avgMood === null || avgMood === undefined)
      return colors.background.card;
    if (avgMood < 1) return colors.mood.awful;
    if (avgMood < 2) return colors.mood.bad;
    if (avgMood < 3) return colors.mood.neutral;
    if (avgMood < 4) return colors.mood.good;
    return colors.mood.great;
  };

  // Array of weekday abbreviations
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <Text style={styles.sectionTitle}>Recent Moods</Text>
        <TouchableOpacity
          style={styles.calendarIcon}
          onPress={() => onCalendarPress()}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={24}
            color={colors.brand.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekdayHeader}>
        {weekdays.map((day, index) => (
          <Text key={index} style={styles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>

      <FlatList
        data={biWeeklyData}
        renderItem={({ item }) => {
          // Calculate average mood if both moods exist
          let avgMood = null;
          if (item.moods[0] !== null && item.moods[1] !== null) {
            avgMood = (item.moods[0] + item.moods[1]) / 2;
          } else if (item.moods[0] !== null) {
            avgMood = item.moods[0];
          } else if (item.moods[1] !== null) {
            avgMood = item.moods[1];
          }

          const color = getMoodColor(avgMood);

          return (
            <TouchableOpacity
              style={[
                styles.dayBubble,
                { backgroundColor: color },
                // Add a highlight border for today
                item.isToday && styles.todayBubble,
              ]}
              onPress={() => onCalendarPress({ dateString: item.date })}
            >
              <Text
                style={[
                  styles.dayText,
                  // Use dark text for empty/light colored bubbles
                  !avgMood || avgMood >= 2 ? styles.darkText : styles.lightText,
                  item.isToday && styles.todayText,
                ]}
              >
                {item.dayOfMonth}
              </Text>
            </TouchableOpacity>
          );
        }}
        numColumns={7}
        keyExtractor={(item) => item.date}
        scrollEnabled={false}
        columnWrapperStyle={styles.calendarRow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxxl,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  calendarIcon: {
    padding: spacing.sm,
  },
  sectionTitle: {
    ...textStyles.sectionTitle,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  weekdayHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.sm,
  },
  weekdayText: {
    width: 40,
    textAlign: "center",
    color: colors.text.tertiary,
    fontWeight: "600",
    fontSize: 14,
  },
  calendarRow: {
    justifyContent: "space-around",
    marginBottom: spacing.xs,
  },
  dayBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  todayBubble: {
    borderWidth: 2,
    borderColor: colors.brand.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
  },
  lightText: {
    color: colors.text.light,
  },
  darkText: {
    color: colors.text.primary,
  },
  todayText: {
    fontWeight: "700",
  },
});

export default RecentMoods;
