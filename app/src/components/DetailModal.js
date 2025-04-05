import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { moodIcons, weather, activities } from "../data/appData";

/**
 * @deprecated This component is deprecated.
 * Use MoodSummaryModal instead for consistent UI across the app.
 */
const DetailModal = ({ visible, onClose, selectedDay }) => {
  const getActivityWithIcon = (activityName) => {
    const activity = activities.find((a) => a.label === activityName);
    return activity ? `${activity.icon} ${activity.label}` : activityName;
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
          <Text style={styles.modalTitle}>
            {selectedDay?.date || "No Data"}
          </Text>
          {selectedDay?.moods.length > 0 ? (
            <>
              <View style={styles.moodSection}>
                <Text style={styles.sectionTitle}>Morning Mood:</Text>
                <Text
                  style={[
                    styles.moodEmoji,
                    { color: moodIcons[selectedDay.moods[0]].color },
                  ]}
                >
                  {moodIcons[selectedDay.moods[0]].emoji}
                </Text>
              </View>
              <View style={styles.moodSection}>
                <Text style={styles.sectionTitle}>Evening Mood:</Text>
                <Text
                  style={[
                    styles.moodEmoji,
                    { color: moodIcons[selectedDay.moods[1]].color },
                  ]}
                >
                  {moodIcons[selectedDay.moods[1]].emoji}
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
            </>
          ) : (
            <Text style={styles.noDataText}>No data for this day.</Text>
          )}
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
});

export default DetailModal;
