import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Calendar } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { moodIcons } from "../data/moodIcons";
import { weather } from "../data/weather";
import { activities } from "../data/activities";

const MoodScreen = () => {
  const navigation = useNavigation();
  const [morningMood, setMorningMood] = useState(null);
  const [eveningMood, setEveningMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [notes, setNotes] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const formatDate = () => {
    const today = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = days[today.getDay()];
    const date = today.getDate();
    const month = months[today.getMonth()];

    return `${day}, ${date} ${month}`;
  };

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleLogMood = () => {
    setShowSummary(true);
  };

  const handleSave = () => {
    console.log({
      morningMood,
      eveningMood,
      activities: selectedActivities,
      weather: selectedWeather,
      notes,
    });
    setShowSummary(false);
    navigation.navigate("Home");
  };

  const getMoodLabel = (moodIndex) => {
    if (moodIndex === null) return "Not specified";
    const mood = moodIcons[moodIndex];
    return `${mood.emoji} ${mood.label}`;
  };

  const getActivityWithIcon = (activityName) => {
    const activity = activities.find((a) => a.label === activityName);
    return activity ? `${activity.icon} ${activity.label}` : activityName;
  };

  const getWeatherWithIcon = (weatherName) => {
    if (!weatherName) return "Not specified";
    const weatherOption = weather.find((w) => w.label === weatherName);
    return weatherOption
      ? `${weatherOption.icon} ${weatherOption.label}`
      : weatherName;
  };

  const SummaryModal = () => (
    <Modal
      visible={showSummary}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSummary(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{formatDate()}</Text>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Morning Mood:</Text>
            <Text style={styles.summaryValue}>{getMoodLabel(morningMood)}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Evening Mood:</Text>
            <Text style={styles.summaryValue}>{getMoodLabel(eveningMood)}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Activities:</Text>
            <Text style={styles.summaryValue}>
              {selectedActivities.length > 0
                ? selectedActivities.map(getActivityWithIcon).join(", ")
                : "Not specified"}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Weather:</Text>
            <Text style={styles.summaryValue}>
              {getWeatherWithIcon(selectedWeather)}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Notes:</Text>
            <Text style={styles.summaryValue}>
              {notes.trim() || "Not specified"}
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.backButton]}
              onPress={() => setShowSummary(false)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const MoodSelector = ({ label, selectedMood, onSelect }) => (
    <View style={styles.moodSelector}>
      <Text style={styles.moodLabel}>{label}</Text>
      <View style={styles.moodRow}>
        {moodIcons.map((mood, index) => (
          <TouchableOpacity
            key={`${label}-${index}`}
            style={[
              styles.moodButton,
              { backgroundColor: mood.color },
              selectedMood === index && styles.selectedMoodButton,
            ]}
            onPress={() => onSelect(selectedMood === index ? null : index)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => navigation.navigate("Calendar")}
        >
          <Calendar size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>{formatDate()}</Text>
      </View>

      {/* Mood Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>
        <MoodSelector
          label="Morning Mood"
          selectedMood={morningMood}
          onSelect={setMorningMood}
        />
        <MoodSelector
          label="Evening Mood"
          selectedMood={eveningMood}
          onSelect={setEveningMood}
        />
      </View>

      {/* Activity Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What have you been up to?</Text>
        <View style={styles.iconGrid}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.label}
              style={[
                styles.iconButton,
                selectedActivities.includes(activity.label) &&
                  styles.selectedIcon,
              ]}
              onPress={() => toggleActivity(activity.label)}
            >
              <Text style={styles.iconText}>{activity.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Weather Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's the weather like?</Text>
        <View style={styles.iconRow}>
          {weather.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.iconButton,
                selectedWeather === option.label && styles.selectedIcon,
              ]}
              onPress={() =>
                setSelectedWeather(
                  selectedWeather === option.label ? null : option.label
                )
              }
            >
              <Text style={styles.iconText}>{option.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Any thoughts to share?</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={4}
          placeholder="Write your thoughts here..."
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Submit Button - Now always enabled */}
      <TouchableOpacity style={styles.submitButton} onPress={handleLogMood}>
        <Text style={styles.submitButtonText}>Log Mood</Text>
      </TouchableOpacity>

      <SummaryModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: "relative",
  },
  calendarButton: {
    position: "absolute",
    right: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  moodSelector: {
    marginBottom: 20,
  },
  moodLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedMoodButton: {
    transform: [{ scale: 1.4 }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodEmoji: {
    fontSize: 24,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  selectedIcon: {
    backgroundColor: "#00BFFF",
    transform: [{ scale: 1.2 }],
  },
  iconText: {
    fontSize: 24,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
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
  summarySection: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
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

export default MoodScreen;
