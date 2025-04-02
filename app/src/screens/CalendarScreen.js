import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import { sampleData } from "../data/sampleData";
import { moodIcons } from "../data/moodIcons";
import { weather } from "../data/weather";
import { activities } from "../data/activities";

export default function CalendarScreen() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);

  // Filter data based on selected activity and weather
  const filteredData = sampleData.filter((item) => {
    const activityMatch =
      !selectedActivity || item.activities.includes(selectedActivity);
    const weatherMatch = !selectedWeather || item.weather === selectedWeather;
    return activityMatch && weatherMatch;
  });

  // Transform filtered data into markedDates format with custom markers
  const markedDates = filteredData.reduce((acc, item) => {
    const avgMood = (item.moods[0] + item.moods[1]) / 2;
    const color =
      avgMood < 1
        ? "#ef4444"
        : avgMood < 2
        ? "#f97316"
        : avgMood < 3
        ? "#facc15"
        : avgMood < 4
        ? "#84cc16"
        : "#22c55e";

    acc[item.date] = {
      marked: true,
      dotColor: color,
      customStyles: {
        container: {
          backgroundColor: color,
          borderRadius: 15,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        },
        text: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "bold",
        },
      },
    };
    return acc;
  }, {});

  const onDayPress = (day) => {
    const selected = filteredData.find((item) => item.date === day.dateString);
    setSelectedDay(
      selected || {
        date: day.dateString,
        moods: [],
        activities: [],
        weather: "N/A",
      }
    );
    setModalVisible(true);
  };

  const getActivityWithIcon = (activityName) => {
    const activity = activities.find((a) => a.label === activityName);
    return activity ? `${activity.icon} ${activity.label}` : activityName;
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        markingType="custom"
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#22c55e",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#22c55e",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
        }}
      />

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

      {/* Modal for Day Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
                      ? selectedDay.activities
                          .map(getActivityWithIcon)
                          .join(", ")
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  pickerWrapper: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  pickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
    height: 60,
  },
  picker: {
    height: 60,
    width: "100%",
  },
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
