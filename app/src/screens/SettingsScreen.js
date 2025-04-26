import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Switch,
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SettingItem from "../components/SettingItem";
import {
  colors,
  layout,
  spacing,
  buttons,
  textStyles,
  typography,
} from "../constants";
import { activities } from "../data/appData";
import {
  loadMoodData,
  saveMoodData,
  loadCustomActivities,
  saveCustomActivities,
  saveHiddenActivities,
  loadHiddenActivities,
} from "../utils/storage";

export default function SettingsScreen() {
  // Notification settings
  const [dailyReminders, setDailyReminders] = useState(true);
  const [morningReminder, setMorningReminder] = useState("08:00");
  const [eveningReminder, setEveningReminder] = useState("20:00");
  const [weeklyReports, setWeeklyReports] = useState(false);

  // Display settings
  const [showStreak, setShowStreak] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [defaultView, setDefaultView] = useState("week");

  // Activity management
  const [customActivities, setCustomActivities] = useState([]);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [newActivityIcon, setNewActivityIcon] = useState("🚶");
  const [newActivityLabel, setNewActivityLabel] = useState("");
  const [hiddenDefaultActivities, setHiddenDefaultActivities] = useState([]);

  // Privacy settings
  const [dataExportVisible, setDataExportVisible] = useState(false);
  const [dataExportFormat, setDataExportFormat] = useState("json");

  // Time picker modal
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeType, setTimeType] = useState("morning");
  const [tempTime, setTempTime] = useState("");

  useEffect(() => {
    // Load custom activities and hidden default activities
    const loadActivities = async () => {
      const customActs = await loadCustomActivities();
      if (customActs && customActs.length > 0) {
        setCustomActivities(customActs);
      }

      try {
        // Get any previously hidden default activities
        const hiddenActs = await loadHiddenActivities();
        if (hiddenActs && hiddenActs.length > 0) {
          setHiddenDefaultActivities(hiddenActs);
        }
      } catch (error) {
        console.error("Error loading hidden activities:", error);
      }
    };

    loadActivities();
  }, []);

  const handleHideDefaultActivity = (activity) => {
    const updated = [...hiddenDefaultActivities, activity.label];
    saveHiddenActivities(updated);
    setHiddenDefaultActivities(updated);
  };

  const restoreDefaultActivities = () => {
    Alert.alert(
      "Restore Default Activities",
      "This will restore all hidden default activities. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          onPress: () => {
            saveHiddenActivities([]);
            setHiddenDefaultActivities([]);
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    // Export logic would go here (in a real app)
    Alert.alert(
      "Export Data",
      `Your data would be exported in ${dataExportFormat.toUpperCase()} format.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Export", onPress: () => console.log("Data exported") },
      ]
    );
    setDataExportVisible(false);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all your mood data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: () => {
            saveMoodData([]);
            Alert.alert("Success", "All data has been cleared.");
          },
        },
      ]
    );
  };

  const handleSetTime = (type, time) => {
    if (type === "morning") {
      setMorningReminder(time);
    } else {
      setEveningReminder(time);
    }
    setShowTimePicker(false);
  };

  const openTimePicker = (type, currentTime) => {
    setTimeType(type);
    setTempTime(currentTime);
    setShowTimePicker(true);
  };

  const renderTimePickerModal = () => (
    <Modal visible={showTimePicker} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.timePickerContainer}>
          <Text style={styles.timePickerTitle}>
            Set {timeType === "morning" ? "Morning" : "Evening"} Reminder Time
          </Text>

          <TextInput
            style={styles.timeInput}
            value={tempTime}
            onChangeText={setTempTime}
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.timeHint}>
            Format: 24-hour (e.g., 08:00 or 20:00)
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => handleSetTime(timeType, tempTime)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderExportOptions = () => (
    <Modal visible={dataExportVisible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Export Format</Text>

          <TouchableOpacity
            style={[
              styles.formatOption,
              dataExportFormat === "json" && styles.selectedFormat,
            ]}
            onPress={() => setDataExportFormat("json")}
          >
            <Text style={styles.formatText}>JSON</Text>
            {dataExportFormat === "json" && (
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={colors.brand.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.formatOption,
              dataExportFormat === "csv" && styles.selectedFormat,
            ]}
            onPress={() => setDataExportFormat("csv")}
          >
            <Text style={styles.formatText}>CSV</Text>
            {dataExportFormat === "csv" && (
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={colors.brand.primary}
              />
            )}
          </TouchableOpacity>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setDataExportVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleExportData}
            >
              <Text style={styles.buttonText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderActivitiesModal = () => (
    <Modal
      visible={showActivitiesModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.activitiesContainer}>
          <Text style={styles.modalTitle}>Activity Management</Text>

          {/* Add new activity form */}
          <View style={styles.addActivityForm}>
            <Text style={styles.addActivityTitle}>Add New Activity</Text>

            <View style={styles.formRow}>
              <TextInput
                style={styles.iconInput}
                value={newActivityIcon}
                onChangeText={setNewActivityIcon}
                placeholder=""
                maxLength={2}
              />

              <TextInput
                style={styles.activityInput}
                value={newActivityLabel}
                onChangeText={setNewActivityLabel}
                placeholder="Activity name"
                maxLength={15}
              />

              <TouchableOpacity
                style={[
                  styles.addButton,
                  (!newActivityLabel.trim() || !newActivityIcon.trim()) &&
                    styles.disabledButton,
                ]}
                disabled={!newActivityLabel.trim() || !newActivityIcon.trim()}
                onPress={() => {
                  if (newActivityLabel.trim() && newActivityIcon.trim()) {
                    const newActivity = {
                      label: newActivityLabel.trim(),
                      icon: newActivityIcon.trim(),
                    };
                    const updatedActivities = [
                      ...customActivities,
                      newActivity,
                    ];
                    setCustomActivities(updatedActivities);
                    saveCustomActivities(updatedActivities);
                    setNewActivityLabel("");
                    setNewActivityIcon("🚶");
                  }
                }}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.emojiHint}>
              Type or paste an emoji from your keyboard (e.g. 🏃, 🧘, 🎮)
            </Text>
          </View>

          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>Default Activities</Text>
            {hiddenDefaultActivities.length > 0 && (
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={restoreDefaultActivities}
              >
                <Text style={styles.restoreButtonText}>Restore Hidden</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.activitiesList}>
            {activities
              .filter(
                (activity) => !hiddenDefaultActivities.includes(activity.label)
              )
              .map((activity, index) => (
                <View key={`default-${index}`} style={styles.activityItem}>
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                  <Text style={styles.activityLabel}>{activity.label}</Text>
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert(
                        "Hide Default Activity",
                        `Do you want to hide "${activity.label}" from the activities list? You can restore it later.`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Hide",
                            onPress: () => handleHideDefaultActivity(activity),
                          },
                        ]
                      );
                    }}
                  >
                    <MaterialCommunityIcons
                      name="eye-off-outline"
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              ))}

            {hiddenDefaultActivities.length > 0 && (
              <Text style={styles.hiddenActivitiesText}>
                {hiddenDefaultActivities.length} default{" "}
                {hiddenDefaultActivities.length === 1
                  ? "activity"
                  : "activities"}{" "}
                hidden
              </Text>
            )}

            {customActivities.length > 0 && (
              <>
                <Text style={styles.sectionDivider}>Custom Activities</Text>
                {customActivities.map((activity, index) => (
                  <View key={`custom-${index}`} style={styles.activityItem}>
                    <Text style={styles.activityIcon}>{activity.icon}</Text>
                    <Text style={styles.activityLabel}>{activity.label}</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        Alert.alert(
                          "Delete Activity",
                          `Are you sure you want to delete "${activity.label}"?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => {
                                const updated = [...customActivities];
                                updated.splice(index, 1);
                                setCustomActivities(updated);
                                saveCustomActivities(updated);
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <MaterialCommunityIcons
                        name="delete-outline"
                        size={20}
                        color={colors.mood.awful}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {customActivities.length === 0 &&
              hiddenDefaultActivities.length === 0 &&
              activities.length === 0 && (
                <Text style={styles.noActivitiesText}>
                  No activities found. Add some activities to track your mood
                  with activities.
                </Text>
              )}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowActivitiesModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[colors.white, colors.background.secondary, colors.white]}
        style={styles.contentContainer}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Notification Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <SettingItem
            title="Daily Mood Reminders"
            description="Receive reminders to log your mood"
            value={dailyReminders}
            onValueChange={setDailyReminders}
          />

          {dailyReminders && (
            <>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => openTimePicker("morning", morningReminder)}
              >
                <View style={styles.timeButtonContent}>
                  <View>
                    <Text style={styles.timeButtonTitle}>Morning Reminder</Text>
                    <Text style={styles.timeButtonDescription}>
                      Remind me at {morningReminder}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={colors.text.secondary}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => openTimePicker("evening", eveningReminder)}
              >
                <View style={styles.timeButtonContent}>
                  <View>
                    <Text style={styles.timeButtonTitle}>Evening Reminder</Text>
                    <Text style={styles.timeButtonDescription}>
                      Remind me at {eveningReminder}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={colors.text.secondary}
                  />
                </View>
              </TouchableOpacity>
            </>
          )}

          <SettingItem
            title="Weekly Summary Reports"
            description="Receive weekly insights about your mood patterns"
            value={weeklyReports}
            onValueChange={setWeeklyReports}
          />
        </View>

        {/* Display Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Preferences</Text>
          <SettingItem
            title="Show Streak Counter"
            description="Display your current logging streak on home screen"
            value={showStreak}
            onValueChange={setShowStreak}
          />

          <SettingItem
            title="Dark Mode"
            description="Coming soon"
            value={darkMode}
            onValueChange={setDarkMode}
            disabled={true}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowActivitiesModal(true)}
          >
            <View style={styles.buttonWithIcon}>
              <Text style={styles.buttonText}>Manage Activities</Text>
              <MaterialCommunityIcons
                name="format-list-checks"
                size={20}
                color={colors.text.primary}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy & Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setDataExportVisible(true)}
          >
            <View style={styles.buttonWithIcon}>
              <Text style={styles.buttonText}>Export Data</Text>
              <MaterialCommunityIcons
                name="export"
                size={20}
                color={colors.text.primary}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearData}
          >
            <View style={styles.buttonWithIcon}>
              <Text style={[styles.buttonText, styles.dangerText]}>
                Clear All Data
              </Text>
              <MaterialCommunityIcons
                name="delete-forever"
                size={20}
                color={colors.mood.awful}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* About & Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonWithIcon}>
              <Text style={styles.buttonText}>Privacy Policy</Text>
              <MaterialCommunityIcons
                name="shield-account"
                size={20}
                color={colors.text.primary}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonWithIcon}>
              <Text style={styles.buttonText}>Terms of Service</Text>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={20}
                color={colors.text.primary}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={styles.buttonWithIcon}>
              <Text style={styles.buttonText}>Help & Support</Text>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={20}
                color={colors.text.primary}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>MoodWise v1.0.0</Text>
          </View>
        </View>
      </LinearGradient>

      {renderTimePickerModal()}
      {renderExportOptions()}
      {renderActivitiesModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: layout.container,
  contentContainer: layout.gradientContainer,
  title: {
    ...textStyles.title,
    color: colors.text.primary,
    marginBottom: spacing.xxl,
  },
  section: layout.section,
  sectionTitle: {
    ...textStyles.sectionTitle,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    marginLeft: spacing.xs,
  },
  button: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: buttons.secondary.borderRadius,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: colors.background.danger,
  },
  dangerText: {
    color: colors.mood.awful,
  },
  buttonText: {
    fontSize: textStyles.body.fontSize,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: "center",
  },
  timeButton: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: buttons.secondary.borderRadius,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeButtonTitle: {
    fontSize: textStyles.body.fontSize,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  timeButtonDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  versionContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  timePickerContainer: {
    width: "85%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  timeInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 18,
    textAlign: "center",
    marginVertical: spacing.lg,
  },
  timeHint: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  formatOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  selectedFormat: {
    borderColor: colors.brand.primary,
    backgroundColor: `${colors.brand.primary}10`,
  },
  formatText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    marginRight: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  confirmButton: {
    marginLeft: spacing.sm,
    backgroundColor: colors.brand.primary,
  },
  activitiesContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.secondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  activitiesList: {
    flex: 1,
    marginBottom: spacing.md,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  activityLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  sectionDivider: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.secondary,
    marginVertical: spacing.lg,
  },
  closeButton: {
    backgroundColor: colors.brand.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  addActivityForm: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  addActivityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconInput: {
    width: 60,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    fontSize: 20,
    textAlign: "center",
  },
  activityInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  emojiHint: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  restoreButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
  },
  restoreButtonText: {
    fontSize: 14,
    color: colors.brand.primary,
    fontWeight: "500",
  },
  hiddenActivitiesText: {
    textAlign: "center",
    fontSize: 14,
    color: colors.text.tertiary,
    fontStyle: "italic",
    marginVertical: spacing.md,
  },
  noActivitiesText: {
    textAlign: "center",
    fontSize: 16,
    color: colors.text.tertiary,
    fontStyle: "italic",
    marginVertical: spacing.lg,
  },
  addButton: {
    width: 44,
    height: 50,
    backgroundColor: colors.brand.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  disabledButton: {
    backgroundColor: colors.text.disabled,
  },
  defaultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
