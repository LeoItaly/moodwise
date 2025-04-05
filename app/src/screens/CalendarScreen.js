import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import { sampleData, weather, activities, moodIcons } from "../data/appData";
import {
  colors,
  layout,
  spacing,
  borderRadius,
  textStyles,
  buttons,
} from "../constants";

// Custom wrapper for MoodSummaryModal that only shows a Back button
const ReadOnlyMoodModal = ({ visible, onClose, selectedDay }) => {
  if (!selectedDay) return null;

  // Format date for display in modal
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Mood Summary - {formatDateForDisplay(selectedDay.date)}
          </Text>

          {/* Morning Mood */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Morning Mood:</Text>
            <Text style={styles.summaryValue}>
              {getMoodLabel(selectedDay.moods[0])}
            </Text>
          </View>

          {/* Evening Mood */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Evening Mood:</Text>
            <Text style={styles.summaryValue}>
              {getMoodLabel(selectedDay.moods[1])}
            </Text>
          </View>

          {/* Activities */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Activities:</Text>
            {selectedDay.activities && selectedDay.activities.length > 0 ? (
              <View style={styles.activitiesContainer}>
                {selectedDay.activities.map((activity, index) => (
                  <View key={index} style={styles.activityRow}>
                    <Text style={styles.activityIcon}>
                      {getActivityIcon(activity)}
                    </Text>
                    <Text style={styles.activityText}>
                      {getActivityDisplayName(activity)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.summaryValue}>Not specified</Text>
            )}
          </View>

          {/* Weather */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Weather:</Text>
            {selectedDay.weather ? (
              <View style={styles.weatherRow}>
                <Text style={styles.weatherIcon}>
                  {getWeatherIcon(selectedDay.weather)}
                </Text>
                <Text style={styles.weatherText}>{selectedDay.weather}</Text>
              </View>
            ) : (
              <Text style={styles.summaryValue}>Not specified</Text>
            )}
          </View>

          {/* Notes */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Notes:</Text>
            <Text style={styles.summaryValue}>
              {selectedDay.notes ? selectedDay.notes : "Not specified"}
            </Text>
          </View>

          {/* Single Back button */}
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Helper functions
  function getMoodLabel(moodIndex) {
    if (moodIndex === null || moodIndex === undefined) return "Not specified";
    const mood = moodIcons[moodIndex];
    return mood ? `${mood.emoji} ${mood.label}` : "Not specified";
  }

  function getWeatherIcon(weatherName) {
    if (!weatherName) return null;
    const weatherOption = weather.find((w) => w.label === weatherName);
    return weatherOption ? weatherOption.icon : null;
  }

  function getActivityIcon(activityName) {
    const activity = activities.find((a) => a.label === activityName);
    return activity ? activity.icon : null;
  }

  function getActivityDisplayName(activityName) {
    const activity = activities.find((a) => a.label === activityName);
    return activity ? activity.label : activityName;
  }
};

export default function CalendarScreen({ route }) {
  // Get the selectedDate from navigation params if available
  const { selectedDate } = route.params || {};

  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);

  // Get today's date in YYYY-MM-DD format for initialization
  const getTodayFormatted = () => {
    const today = new Date();
    return formatDateISO(today);
  };

  // Use useEffect to handle initial selected date from navigation
  useEffect(() => {
    if (selectedDate) {
      // Find the mood data for the selected date
      const selected = sampleData.find((item) => item.date === selectedDate);

      // Set the selected day and show the modal
      setSelectedDay(
        selected || {
          date: selectedDate,
          moods: [null, null],
          activities: [],
          weather: null,
          notes: "",
        }
      );
      setModalVisible(true);
    }
  }, [selectedDate]);

  // Filter data based on selected activity and weather
  const filteredData = sampleData.filter((item) => {
    const activityMatch =
      !selectedActivity || item.activities.includes(selectedActivity);
    const weatherMatch = !selectedWeather || item.weather === selectedWeather;
    return activityMatch && weatherMatch;
  });

  // Transform filtered data into markedDates format with custom markers
  const markedDates = filteredData.reduce((acc, item) => {
    // Calculate average mood if both moods exist
    let avgMood = null;
    if (item.moods[0] !== null && item.moods[1] !== null) {
      avgMood = (item.moods[0] + item.moods[1]) / 2;
    } else if (item.moods[0] !== null) {
      avgMood = item.moods[0];
    } else if (item.moods[1] !== null) {
      avgMood = item.moods[1];
    }

    // Get color based on mood
    const color = getMoodColor(avgMood);

    // Is today's date?
    const today = new Date();
    const formattedToday = formatDateISO(today);
    const isToday = item.date === formattedToday;

    acc[item.date] = {
      marked: false, // No dot marker
      customStyles: {
        container: {
          backgroundColor: color,
          borderRadius: 20,
          width: 40, // Match exactly with bi-weekly calendar
          height: 40, // Match exactly with bi-weekly calendar
          alignItems: "center",
          justifyContent: "center",
          borderWidth: isToday ? 2 : 0,
          borderColor: isToday ? colors.brand.primary : "transparent",
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        },
        text: {
          color: colors.text.primary, // Always black text for ALL days
          fontSize: 14,
          fontWeight: isToday ? "700" : "600",
        },
      },
    };
    return acc;
  }, {});

  // Also add today's date to markedDates if it's not already in filteredData
  const todayFormatted = getTodayFormatted();
  if (!markedDates[todayFormatted]) {
    markedDates[todayFormatted] = {
      marked: false,
      customStyles: {
        container: {
          backgroundColor: colors.background.card,
          borderRadius: 20,
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: colors.brand.primary,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        },
        text: {
          color: colors.text.primary,
          fontSize: 14,
          fontWeight: "700",
        },
      },
    };
  }

  const onDayPress = (day) => {
    const selected = filteredData.find((item) => item.date === day.dateString);
    setSelectedDay(
      selected || {
        date: day.dateString,
        moods: [null, null],
        activities: [],
        weather: null,
        notes: "",
      }
    );
    setModalVisible(true);
  };

  // Helper function to format date as YYYY-MM-DD
  function formatDateISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Helper function to get mood color
  function getMoodColor(avgMood) {
    if (avgMood === null || avgMood === undefined)
      return colors.background.card;
    if (avgMood < 1) return colors.mood.awful;
    if (avgMood < 2) return colors.mood.bad;
    if (avgMood < 3) return colors.mood.neutral;
    if (avgMood < 4) return colors.mood.good;
    return colors.mood.great;
  }

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
          onDayPress={onDayPress}
          markingType="custom"
          initialDate={todayFormatted} // Show current month by default
          current={todayFormatted} // Ensure the current month is displayed
          theme={{
            backgroundColor: colors.background.card,
            calendarBackground: colors.background.card,
            textSectionTitleColor: colors.text.tertiary,
            textSectionTitleDisabledColor: colors.text.disabled,
            selectedDayBackgroundColor: colors.mood.great,
            selectedDayTextColor: colors.text.primary, // Keep text black even when selected
            todayTextColor: colors.text.primary, // Keep today's text black
            dayTextColor: colors.text.primary, // All regular days black text
            textDisabledColor: colors.text.disabled,
            dotColor: "transparent", // No dots
            selectedDotColor: "transparent", // No dots even when selected
            arrowColor: colors.brand.primary,
            disabledArrowColor: colors.text.disabled,
            monthTextColor: colors.text.primary,
            indicatorColor: colors.brand.primary,
            textDayFontWeight: "600",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.filterLabel}>Filter by Activity</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedActivity}
              onValueChange={(value) =>
                setSelectedActivity(value === "None" ? null : value)
              }
              style={styles.picker}
            >
              <Picker.Item label="None" value="None" />
              {activities.map((activity) => (
                <Picker.Item
                  key={activity.label}
                  label={`${activity.icon} ${activity.label}`}
                  value={activity.label}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.pickerWrapper}>
          <Text style={styles.filterLabel}>Filter by Weather</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedWeather}
              onValueChange={(value) =>
                setSelectedWeather(value === "None" ? null : value)
              }
              style={styles.picker}
            >
              <Picker.Item label="None" value="None" />
              {weather.map((w) => (
                <Picker.Item
                  key={w.label}
                  label={`${w.icon} ${w.label}`}
                  value={w.label}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Day Details Modal - Read-only version */}
      {selectedDay && (
        <ReadOnlyMoodModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedDay={selectedDay}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: layout.container,
  calendarContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerWrapper: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  pickerContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    height: 60,
  },
  picker: {
    height: 60,
    width: "100%",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    width: "90%",
    maxWidth: 400,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: "500",
  },
  activitiesContainer: {
    marginTop: 4,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 8,
    width: 26,
    textAlign: "center",
  },
  activityText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherIcon: {
    fontSize: 20,
    marginRight: 8,
    width: 26,
    textAlign: "center",
  },
  weatherText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  backButton: {
    backgroundColor: "#f1f5f9",
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  backButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
