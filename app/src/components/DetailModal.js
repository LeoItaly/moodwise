import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { moodIcons, weather, activities } from "../data/appData";

/**
 * Displays detail information for a selected data point from charts
 */
const DetailModal = ({ visible, onClose, selectedDay }) => {
  const getActivityWithIcon = (activityName) => {
    const activity = activities.find((a) => a.label === activityName);
    return activity ? `${activity.icon} ${activity.label}` : activityName;
  };

  // Format date parts separately for styling
  const getFormattedDateParts = (dateString) => {
    if (!dateString) return { dayName: "No", date: "Date" };

    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2); // Get last 2 digits of year

    return {
      dayName,
      date: `${day}/${month}/${year}`,
    };
  };

  // For compatibility with other code still using the old format
  const formatDate = (dateString) => {
    const { dayName, date } = getFormattedDateParts(dateString);
    return `${dayName}, ${date}`;
  };

  // Check if this is aggregated data (from bar chart) or day data
  const isAggregatedData = selectedDay && selectedDay.type;
  // Check if this is count data from activities/weather bar chart
  const isCountData = selectedDay && selectedDay.isCountData;

  // For bar chart data (activity or weather aggregation)
  const renderAggregatedData = () => {
    if (!selectedDay) return null;

    // Get mood emoji from mood value
    const getMoodEmoji = (moodValue) => {
      // Round to nearest integer for emoji lookup
      const roundedMood = Math.round(moodValue);
      // Find the emoji based on id = roundedMood + 1
      return moodIcons.find((mood) => mood.id === roundedMood + 1)?.emoji;
    };

    // Get color for a mood value
    const getMoodColor = (moodValue) => {
      const roundedMood = Math.round(moodValue);
      return moodIcons.find((mood) => mood.id === roundedMood + 1)?.color;
    };

    // If it's from the count chart, show more detailed information
    if (isCountData) {
      // Sort days by date, most recent first
      const sortedDays = selectedDay.days
        ? [...selectedDay.days].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )
        : [];

      return (
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.dayName}>{selectedDay.type}</Text>
            <Text style={styles.dateValue}>{selectedDay.name}</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Times Logged:</Text>
              <Text style={styles.sectionText}>{selectedDay.count}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Average Mood:</Text>
              <Text
                style={[
                  styles.moodEmoji,
                  { color: getMoodColor(selectedDay.value) },
                ]}
              >
                {getMoodEmoji(selectedDay.value)}
              </Text>
            </View>

            {sortedDays.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Latest Days:</Text>
                <View style={styles.daysList}>
                  {sortedDays.slice(0, 3).map((day, index) => {
                    const avgMood = (day.moods[0] + day.moods[1]) / 2;
                    return (
                      <View key={index} style={styles.dayItem}>
                        <Text style={styles.dayDate}>
                          {formatDate(day.date)}
                        </Text>
                        <View style={styles.dayMoodRow}>
                          <Text style={styles.dayAvgMoodLabel}>Avg Mood: </Text>
                          <Text
                            style={[
                              styles.dayMoodEmoji,
                              { color: getMoodColor(avgMood) },
                            ]}
                          >
                            {getMoodEmoji(avgMood)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  {sortedDays.length > 3 && (
                    <Text style={styles.moreText}>
                      +{sortedDays.length - 3} more days...
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </>
      );
    }

    // Original aggregated data rendering
    return (
      <>
        <View style={styles.dateContainer}>
          <Text style={styles.dayName}>{selectedDay.type}</Text>
          <Text style={styles.dateValue}>{selectedDay.name}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Average Mood:</Text>
            <Text
              style={[
                styles.moodEmoji,
                { color: getMoodColor(selectedDay.value) },
              ]}
            >
              {getMoodEmoji(selectedDay.value)}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Times Logged:</Text>
            <Text style={styles.sectionText}>{selectedDay.count}</Text>
          </View>
        </View>
      </>
    );
  };

  // For day-specific data (from line chart or slope chart)
  const renderDayData = () => {
    if (!selectedDay) return null;

    const { dayName, date } = getFormattedDateParts(selectedDay?.date);

    return (
      <>
        <View style={styles.dateContainer}>
          <Text style={styles.dayName}>{dayName}</Text>
          <Text style={styles.dateValue}>{date}</Text>
        </View>

        <View style={styles.contentContainer}>
          {selectedDay?.moods?.length > 0 ? (
            <>
              <View style={styles.moodSection}>
                <Text style={styles.sectionTitle}>Morning Mood:</Text>
                <Text
                  style={[
                    styles.moodEmoji,
                    {
                      color: moodIcons.find(
                        (m) => m.id === selectedDay.moods[0] + 1
                      )?.color,
                    },
                  ]}
                >
                  {
                    moodIcons.find((m) => m.id === selectedDay.moods[0] + 1)
                      ?.emoji
                  }
                </Text>
              </View>
              <View style={styles.moodSection}>
                <Text style={styles.sectionTitle}>Evening Mood:</Text>
                <Text
                  style={[
                    styles.moodEmoji,
                    {
                      color: moodIcons.find(
                        (m) => m.id === selectedDay.moods[1] + 1
                      )?.color,
                    },
                  ]}
                >
                  {
                    moodIcons.find((m) => m.id === selectedDay.moods[1] + 1)
                      ?.emoji
                  }
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activities:</Text>
                <Text style={styles.sectionText}>
                  {selectedDay.activities.length > 0
                    ? selectedDay.activities.map(getActivityWithIcon).join(", ")
                    : "None"}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weather:</Text>
                <Text style={styles.sectionText}>
                  {weather.find((w) => w.label === selectedDay.weather)?.icon}{" "}
                  {selectedDay.weather}
                </Text>
              </View>
              {selectedDay.notes && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Notes:</Text>
                  <Text style={styles.sectionText}>
                    {selectedDay.notes.length > 100
                      ? selectedDay.notes.substring(0, 100) + "..."
                      : selectedDay.notes}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.noDataText}>No data for this day.</Text>
          )}
        </View>
      </>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {isAggregatedData ? renderAggregatedData() : renderDayData()}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  dateContainer: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  dayName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  dateValue: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  contentContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  moodSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: "#333",
  },
  moodEmoji: {
    fontSize: 24,
    marginLeft: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  daysList: {
    marginTop: 5,
  },
  dayItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dayDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  dayMoodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  dayAvgMoodLabel: {
    fontSize: 12,
    color: "#666",
  },
  dayMoodEmoji: {
    fontSize: 16,
  },
  moreText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 5,
  },
});

export default DetailModal;
