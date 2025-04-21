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

  // Check if this is aggregated data (from bar chart) or day data
  const isAggregatedData = selectedDay && selectedDay.type;
  // Check if this is count data from activities/weather bar chart
  const isCountData = selectedDay && selectedDay.isCountData;

  // For bar chart data (activity or weather aggregation)
  const renderAggregatedData = () => {
    if (!selectedDay) return null;

    // If it's from the count chart, show more detailed information
    if (isCountData) {
      return (
        <>
          <Text style={styles.modalTitle}>
            {selectedDay.type}: {selectedDay.name}
          </Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Times Logged:</Text>
            <Text style={styles.sectionText}>{selectedDay.count}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Average Mood:</Text>
            <Text style={styles.sectionText}>
              {selectedDay.value.toFixed(1)}
            </Text>
          </View>

          {selectedDay.days && selectedDay.days.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Days:</Text>
              <View style={styles.daysList}>
                {selectedDay.days.slice(0, 5).map((day, index) => (
                  <View key={index} style={styles.dayItem}>
                    <Text style={styles.dayDate}>{day.date}</Text>
                    <Text style={styles.dayAvgMood}>
                      Avg Mood: {((day.moods[0] + day.moods[1]) / 2).toFixed(1)}
                    </Text>
                  </View>
                ))}
                {selectedDay.days.length > 5 && (
                  <Text style={styles.moreText}>
                    +{selectedDay.days.length - 5} more days...
                  </Text>
                )}
              </View>
            </View>
          )}
        </>
      );
    }

    // Original aggregated data rendering
    return (
      <>
        <Text style={styles.modalTitle}>
          {selectedDay.type}: {selectedDay.name}
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Average Mood:</Text>
          <Text style={styles.sectionText}>{selectedDay.value.toFixed(1)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Times Logged:</Text>
          <Text style={styles.sectionText}>{selectedDay.count}</Text>
        </View>
      </>
    );
  };

  // For day-specific data (from line chart or slope chart)
  const renderDayData = () => {
    if (!selectedDay) return null;

    return (
      <>
        <Text style={styles.modalTitle}>{selectedDay?.date || "No Data"}</Text>
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  dayAvgMood: {
    fontSize: 12,
    color: "#666",
  },
  moreText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 5,
  },
});

export default DetailModal;
