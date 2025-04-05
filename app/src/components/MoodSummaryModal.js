import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { moodIcons, activities, weather } from "../data/appData";

const MoodSummaryModal = ({
  visible,
  onClose,
  onSave,
  dateString,
  morningMood,
  eveningMood,
  selectedActivities,
  selectedWeather,
  notes,
  isTodaysMood = false,
  isUpdating = false,
  previousMoodData = null,
  customActivities = [],
}) => {
  const getMoodLabel = (moodIndex) => {
    if (moodIndex === null || moodIndex === undefined) return "Not specified";
    const mood = moodIcons[moodIndex];
    return `${mood.emoji} ${mood.label}`;
  };

  const getWeatherIcon = (weatherName) => {
    if (!weatherName) return null;
    const weatherOption = weather.find((w) => w.label === weatherName);
    return weatherOption ? weatherOption.icon : null;
  };

  const getActivityIcon = (activityName) => {
    // Check in standard activities first
    const activity = activities.find((a) => a.label === activityName);
    if (activity) return activity.icon;

    // Then check in custom activities
    if (customActivities && customActivities.length > 0) {
      const customActivity = customActivities.find(
        (a) => a.label === activityName
      );
      if (customActivity) return customActivity.icon;
    }

    return null;
  };

  // Get display name for an activity
  const getActivityDisplayName = (activityName) => {
    // First check standard activities
    const standardActivity = activities.find((a) => a.label === activityName);
    if (standardActivity) return standardActivity.label;

    // Then check custom activities
    if (customActivities && customActivities.length > 0) {
      const customActivity = customActivities.find(
        (a) => a.label === activityName
      );
      if (customActivity) return customActivity.label;
    }

    return activityName;
  };

  // Check if a value has changed from previous data
  const hasChanged = (field, currentValue, previousField) => {
    if (!isUpdating || !previousMoodData) return false;

    switch (field) {
      case "morningMood":
        return currentValue !== previousMoodData.morningMood;
      case "eveningMood":
        return currentValue !== previousMoodData.eveningMood;
      case "weather":
        return currentValue !== previousMoodData.weather;
      case "notes":
        return currentValue.trim() !== previousMoodData.notes.trim();
      case "activity":
        // For activities, check if this specific activity was added or removed
        return (
          previousMoodData.activities.includes(currentValue) !==
          selectedActivities.includes(currentValue)
        );
      default:
        return false;
    }
  };

  // Get a style based on whether the field has changed
  const getChangeStyle = (field, value, previousField) => {
    return hasChanged(field, value, previousField) ? styles.changedValue : {};
  };

  // For activities, check if the overall selection has changed
  const activitiesChanged = () => {
    if (!isUpdating || !previousMoodData) return false;

    // Check if activities length is different
    if (selectedActivities.length !== previousMoodData.activities.length) {
      return true;
    }

    // Check if any activity is different
    for (const activity of selectedActivities) {
      if (!previousMoodData.activities.includes(activity)) {
        return true;
      }
    }

    for (const activity of previousMoodData.activities) {
      if (!selectedActivities.includes(activity)) {
        return true;
      }
    }

    return false;
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
            {isTodaysMood ? "Today's Mood" : "Mood Summary"} - {dateString}
          </Text>

          {isUpdating && previousMoodData && (
            <Text style={styles.updateText}>
              Changed fields are highlighted in green
            </Text>
          )}

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Morning Mood:</Text>
            <Text
              style={[
                styles.summaryValue,
                getChangeStyle("morningMood", morningMood),
              ]}
            >
              {getMoodLabel(morningMood)}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Evening Mood:</Text>
            <Text
              style={[
                styles.summaryValue,
                getChangeStyle("eveningMood", eveningMood),
              ]}
            >
              {getMoodLabel(eveningMood)}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Activities:</Text>
            {selectedActivities && selectedActivities.length > 0 ? (
              <View
                style={[
                  styles.activitiesContainer,
                  activitiesChanged() ? styles.activitiesChanged : {},
                ]}
              >
                {selectedActivities.map((activity, index) => (
                  <View key={index} style={styles.activityRow}>
                    <Text style={styles.activityIcon}>
                      {getActivityIcon(activity)}
                    </Text>
                    <Text
                      style={[
                        styles.activityText,
                        getChangeStyle("activity", activity),
                      ]}
                    >
                      {getActivityDisplayName(activity)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.summaryValue}>Not specified</Text>
            )}
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Weather:</Text>
            {selectedWeather ? (
              <View style={styles.weatherRow}>
                <Text style={styles.weatherIcon}>
                  {getWeatherIcon(selectedWeather)}
                </Text>
                <Text
                  style={[
                    styles.weatherText,
                    getChangeStyle("weather", selectedWeather),
                  ]}
                >
                  {selectedWeather}
                </Text>
              </View>
            ) : (
              <Text style={styles.summaryValue}>Not specified</Text>
            )}
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Notes:</Text>
            <Text style={[styles.summaryValue, getChangeStyle("notes", notes)]}>
              {notes && notes.trim() ? notes.trim() : "Not specified"}
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.backButton]}
              onPress={onClose}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>
                {isUpdating ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
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
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
  },
  updateText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  changedValue: {
    color: "#22c55e", // Green color for changed values
    fontWeight: "bold",
  },
  activitiesContainer: {
    marginTop: 4,
  },
  activitiesChanged: {
    borderLeftWidth: 2,
    borderLeftColor: "#22c55e",
    paddingLeft: 8,
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
    color: "#1e293b",
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
    color: "#1e293b",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#f1f5f9",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  backButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MoodSummaryModal;
