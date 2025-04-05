import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Calendar, ArrowLeft } from "lucide-react-native";
import MoodSelector from "./MoodSelector";
import ActivitySelector from "./ActivitySelector";
import WeatherSelector from "./WeatherSelector";
import {
  colors,
  layout,
  buttons,
  spacing,
  borderRadius,
  textStyles,
} from "../constants";

const MoodLogger = ({
  onBack,
  onCalendarPress,
  onLogMood,
  morningMood,
  setMorningMood,
  eveningMood,
  setEveningMood,
  selectedActivities,
  toggleActivity,
  selectedWeather,
  setSelectedWeather,
  notes,
  setNotes,
  formattedDate,
  isUpdating = false,
  customActivities = [],
  onAddCustomActivity,
}) => {
  return (
    <ScrollView style={styles.loggerContainer}>
      {/* Header */}
      <View style={styles.loggerHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.title}>{formattedDate}</Text>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={onCalendarPress}
        >
          <Calendar size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Mood Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling today ?</Text>
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
        <Text style={styles.sectionTitle}>
          Which activities did you do today ?
        </Text>
        <ActivitySelector
          selectedActivities={selectedActivities}
          onToggleActivity={toggleActivity}
          customActivities={customActivities}
          onAddCustomActivity={onAddCustomActivity}
        />
      </View>

      {/* Weather Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's the weather like today?</Text>
        <WeatherSelector
          selectedWeather={selectedWeather}
          onSelectWeather={setSelectedWeather}
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Any thoughts to share ?</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={4}
          placeholder="Write your thoughts here..."
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={onLogMood}>
        <Text style={styles.submitButtonText}>
          {isUpdating ? "Update Mood" : "Log Mood"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loggerContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loggerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.regular,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: spacing.lg,
  },
  calendarButton: {
    position: "absolute",
    right: spacing.lg,
  },
  title: {
    ...textStyles.subtitle,
    color: colors.text.primary,
    textAlign: "center",
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.regular,
  },
  sectionTitle: {
    ...textStyles.sectionTitle,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: buttons.primary,
  submitButtonText: buttons.primaryText,
});

export default MoodLogger;
