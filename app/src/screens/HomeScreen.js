import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { sampleData, activities, weather } from "../data/appData";
import { LinearGradient } from "expo-linear-gradient";
import RecentMoods from "../components/RecentMoods";
import MoodSummaryModal from "../components/MoodSummaryModal";
import MoodLogger from "../components/MoodLogger";
import StreakDisplay from "../components/StreakDisplay";
import {
  saveMoodData,
  loadMoodData,
  saveCustomActivities,
  loadCustomActivities,
  calculateStreak,
} from "../utils/storage";
import {
  colors,
  layout,
  buttons,
  spacing,
  borderRadius,
  textStyles,
} from "../constants";

const getMoodColor = (avgMood) => {
  if (avgMood < 1) return colors.mood.awful;
  if (avgMood < 2) return colors.mood.bad;
  if (avgMood < 3) return colors.mood.neutral;
  if (avgMood < 4) return colors.mood.good;
  return colors.mood.great;
};

// Function to get mood label based on value
const getMoodLabel = (moodValue) => {
  if (moodValue === null || moodValue === undefined) {
    return "Not specified";
  }

  switch (moodValue) {
    case 0:
      return "😢 Awful";
    case 1:
      return "😕 Bad";
    case 2:
      return "😐 Neutral";
    case 3:
      return "🙂 Good";
    case 4:
      return "😊 Great";
    default:
      return "Not specified";
  }
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const buttonOpacityAnim = useRef(new Animated.Value(1)).current;
  const streakScaleAnim = useRef(new Animated.Value(1)).current;
  const [showMoodLogger, setShowMoodLogger] = useState(false);
  const [morningMood, setMorningMood] = useState(null);
  const [eveningMood, setEveningMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [notes, setNotes] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [yesterdayMood, setYesterdayMood] = useState(null);
  const [todaysMoodData, setTodaysMoodData] = useState(null);
  const [allMoodData, setAllMoodData] = useState([...sampleData]);
  const [hasSavedTodaysMood, setHasSavedTodaysMood] = useState(false);
  const [previousMoodData, setPreviousMoodData] = useState(null);
  const [customActivities, setCustomActivities] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(31); // Start with 31-day streak for demo
  const [previousStreak, setPreviousStreak] = useState(31); // Match initial previous streak
  const [calendarSelectedDay, setCalendarSelectedDay] = useState(null);
  const [showCalendarSummary, setShowCalendarSummary] = useState(false);

  // Milestone values for streak celebrations
  const streakMilestones = [3, 7, 14, 30, 60, 90, 180, 365];

  // Load mood data and custom activities from storage on component mount
  useEffect(() => {
    const loadData = async () => {
      const savedMoodData = await loadMoodData();
      if (savedMoodData && savedMoodData.length > 0) {
        setAllMoodData(savedMoodData);
        // For demo purposes, we'll use 31 as initial streak unless calculated streak is higher
        const calculatedStreak = calculateStreak(savedMoodData);
        const demoStreak = Math.max(31, calculatedStreak);
        setCurrentStreak(demoStreak);
        setPreviousStreak(demoStreak);
      }

      const savedCustomActivities = await loadCustomActivities();
      if (savedCustomActivities && savedCustomActivities.length > 0) {
        setCustomActivities(savedCustomActivities);
      }
    };

    loadData();
  }, []);

  // Save custom activities whenever they change
  useEffect(() => {
    if (customActivities.length > 0) {
      saveCustomActivities(customActivities);
    }
  }, [customActivities]);

  useEffect(() => {
    // Only animate if the user hasn't saved today's mood
    if (!hasSavedTodaysMood) {
      // Create a sequence for the animation
      const pulseSequence = Animated.sequence([
        // Scale up and increase opacity
        Animated.parallel([
          Animated.timing(buttonScaleAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(buttonOpacityAnim, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Scale down and restore opacity
        Animated.parallel([
          Animated.timing(buttonScaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(buttonOpacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]);

      // Start the looping animation
      Animated.loop(pulseSequence).start();
    } else {
      // Reset animation values if user has already logged mood
      buttonScaleAnim.setValue(1);
      buttonOpacityAnim.setValue(1);
    }

    // Get yesterday's mood data and check if we've already logged today
    loadMoodData();
  }, [hasSavedTodaysMood]);

  const loadMoodData = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayFormatted = formatDateISO(today);

    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = formatDateISO(yesterday);

    console.log("Today's date:", todayFormatted);
    console.log("Yesterday's date:", yesterdayFormatted);

    // Check if we have data for today
    const todayData = allMoodData.find((day) => day.date === todayFormatted);
    if (todayData) {
      setTodaysMoodData(todayData);
      setHasSavedTodaysMood(true);

      // We'll populate the form fields when the user clicks to update,
      // not automatically when loading data (to keep the form clean for new entries)
    }

    // Find yesterday's mood data
    const yesterdayData = allMoodData.find(
      (day) => day.date === yesterdayFormatted
    );

    if (yesterdayData) {
      setYesterdayMood(yesterdayData);
    } else {
      // For demo purposes, use a hardcoded date if no real yesterday data
      const demoDate = allMoodData.length > 0 ? allMoodData[0].date : null;
      if (demoDate) {
        const demoData = allMoodData.find((day) => day.date === demoDate);
        setYesterdayMood(demoData);
      }
    }
  };

  const formatDateISO = (date) => {
    // Format date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  const formatYesterdayDate = (date) => {
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

    const day = days[date.getDay()];
    const formattedDate = date.toLocaleDateString();

    return `${day}, ${formattedDate}`;
  };

  const addCustomActivity = (customActivity) => {
    // Add the new custom activity to our list
    const updatedCustomActivities = [...customActivities, customActivity];

    setCustomActivities(updatedCustomActivities);

    // Also select this activity automatically
    toggleActivity(customActivity.label);

    // Save the updated custom activities to storage
    saveCustomActivities(updatedCustomActivities);
  };

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleLogMood = () => {
    // Determine if this is an update based on whether we already saved today's mood
    const isUpdating = hasSavedTodaysMood;
    setShowSummary(true);
  };

  // Add this function to check and celebrate streak milestones
  const celebrateStreakMilestone = (streak) => {
    // Only celebrate if streak increased and reached a milestone
    if (
      streak > previousStreak &&
      (streakMilestones.includes(streak) || streak === 32)
    ) {
      let message = "";

      if (streak === 3) {
        message = "You're building a great habit! Keep it up!";
      } else if (streak === 7) {
        message = "A full week of tracking! You're on a roll!";
      } else if (streak === 14) {
        message = "Two weeks straight! That's impressive dedication!";
      } else if (streak === 30) {
        message = "A whole month of mood tracking! You're a MoodWise pro!";
      } else if (streak === 32) {
        message =
          "You've passed the one-month mark! Every day is a new achievement now!";
      } else if (streak === 60) {
        message = "60 days! Your dedication is truly remarkable!";
      } else if (streak === 90) {
        message = "Three months straight! What an achievement!";
      } else if (streak === 180) {
        message =
          "Half a year of consistent tracking! Extraordinary commitment!";
      } else if (streak === 365) {
        message =
          "A FULL YEAR OF TRACKING! You're officially a MoodWise master!";
      }

      // Show celebration alert
      Alert.alert(`${streak} Day Streak! 🎉`, message, [{ text: "Thanks!" }]);
    }
  };

  // Update the animate streak function to include celebration
  const animateStreakChange = (newStreak) => {
    if (newStreak > previousStreak) {
      // Animate if streak has increased
      Animated.sequence([
        Animated.timing(streakScaleAnim, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(streakScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Check if milestone reached
      celebrateStreakMilestone(newStreak);
    }

    setPreviousStreak(newStreak);
    setCurrentStreak(newStreak);
  };

  const handleSave = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayFormatted = formatDateISO(today);

    // Create today's mood data
    const todayData = {
      date: todayFormatted,
      moods: [
        morningMood, // Store null if not selected
        eveningMood, // Store null if not selected
      ],
      activities: selectedActivities,
      weather: selectedWeather, // Store null if not selected
      notes: notes,
      // Save custom activities with the mood entry to preserve them across sessions
      customActivities: customActivities,
    };

    console.log("Saving mood data:", todayData);

    // Update or add today's data to our mood data array
    const newMoodData = [...allMoodData];
    const existingIndex = newMoodData.findIndex(
      (day) => day.date === todayFormatted
    );

    if (existingIndex >= 0) {
      newMoodData[existingIndex] = todayData;
    } else {
      newMoodData.unshift(todayData); // Add to beginning of array
    }

    setAllMoodData(newMoodData);
    setTodaysMoodData(todayData);

    // Save mood data to storage
    saveMoodData(newMoodData);

    // Set flag to indicate we've saved today's mood
    setHasSavedTodaysMood(true);

    // Close modals and go back to home
    setShowSummary(false);
    setShowMoodLogger(false);

    // Show success message with different text based on whether this is an update
    Alert.alert(
      hasSavedTodaysMood ? "Mood Updated" : "Mood Logged",
      hasSavedTodaysMood
        ? "Your mood has been updated successfully!"
        : "Your mood has been saved successfully!",
      [{ text: "OK" }]
    );

    // Then after a short delay, if there's a streak milestone, show that alert
    setTimeout(() => {
      // Special case for the 31-day streak demo
      if (currentStreak === 31 && !hasSavedTodaysMood) {
        // Force increment to 32 days for the demo
        const newStreak = 32;
        animateStreakChange(newStreak);
      } else {
        // Normal streak calculation for all other cases
        const calculatedStreak = calculateStreak(newMoodData);

        // Ensure we never lose streak progress - use the higher value
        const newStreak = Math.max(
          calculatedStreak,
          currentStreak + (!hasSavedTodaysMood ? 1 : 0)
        );
        animateStreakChange(newStreak);
      }
    }, 1000); // 1-second delay

    // Reset form
    setMorningMood(null);
    setEveningMood(null);
    setSelectedActivities([]);
    setSelectedWeather(null);
    setNotes("");

    // Clear previous data after saving
    setPreviousMoodData(null);

    // Update yesterday's mood for next time
    // We simulate this by setting yesterday's mood to what was previously today's mood
    // In a real app, this would happen naturally when the app is opened the next day
    const previousYesterdayMood = yesterdayMood;
    setYesterdayMood(todayData);
  };

  // Function to pre-fill the form with today's data when updating
  const prepareFormForUpdate = () => {
    if (todaysMoodData) {
      // Store current data for later comparison
      setPreviousMoodData({
        morningMood: todaysMoodData.moods[0],
        eveningMood: todaysMoodData.moods[1],
        activities: [...(todaysMoodData.activities || [])],
        weather: todaysMoodData.weather,
        notes: todaysMoodData.notes || "",
      });

      // Pre-fill form with current data
      setMorningMood(todaysMoodData.moods[0]);
      setEveningMood(todaysMoodData.moods[1]);
      setSelectedActivities(todaysMoodData.activities || []);
      setSelectedWeather(todaysMoodData.weather);
      setNotes(todaysMoodData.notes || "");

      // Load custom activities if they exist
      if (
        todaysMoodData.customActivities &&
        todaysMoodData.customActivities.length > 0
      ) {
        setCustomActivities(todaysMoodData.customActivities);
      }
    }
    setShowMoodLogger(true);
  };

  // Ensure streak is always a valid number
  const getValidStreak = () => {
    // If streak is undefined, null, or not a number, return 0
    if (
      currentStreak === undefined ||
      currentStreak === null ||
      isNaN(currentStreak)
    ) {
      return 0;
    }
    // Otherwise, return the current streak as a number
    return Number(currentStreak);
  };

  const renderHomeContent = () => {
    // Get a valid streak value
    const streakValue = getValidStreak();

    return (
      <LinearGradient
        colors={[colors.white, colors.background.secondary, colors.white]}
        style={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.streakWrapper}>
            <StreakDisplay
              streak={streakValue}
              size="medium"
              animated={true}
              scaleAnim={streakScaleAnim}
            />

            <Text style={styles.streakSubtext}>
              Keep logging to increase your streak!
            </Text>
          </View>

          <Animated.View
            style={{
              transform: [{ scale: buttonScaleAnim }],
              opacity: buttonOpacityAnim,
              marginTop: spacing.md,
            }}
          >
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => {
                if (hasSavedTodaysMood) {
                  // If updating, pre-fill the form with existing data
                  prepareFormForUpdate();
                } else {
                  // If new entry, just show the empty form
                  setShowMoodLogger(true);
                }
              }}
            >
              <Text style={styles.ctaButtonText}>
                {hasSavedTodaysMood
                  ? "Change Your Today's Mood"
                  : "Log Today's Mood"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <YesterdaySummary />

        <RecentMoods
          onCalendarPress={(day) => {
            if (day && day.dateString) {
              // Navigate to Calendar screen with the selected date
              navigation.navigate("Calendar", { selectedDate: day.dateString });
            } else {
              // Just navigate to Calendar without a specific date
              navigation.navigate("Calendar");
            }
          }}
          onDayPress={(dayData) => {
            setCalendarSelectedDay(dayData);
            setShowCalendarSummary(true);
          }}
          allMoodData={allMoodData}
        />
      </LinearGradient>
    );
  };

  const YesterdaySummary = () => {
    if (!yesterdayMood) return null;

    const morningMoodData = getMoodLabel(yesterdayMood.moods[0]);
    const eveningMoodData = getMoodLabel(yesterdayMood.moods[1]);

    // Check if yesterday's mood is actually from today (after saving)
    const isActuallyToday =
      hasSavedTodaysMood && yesterdayMood.date === formatDateISO(new Date());

    const getWeatherIcon = (weatherName) => {
      if (!weatherName) return null;
      const weatherOption = weather.find((w) => w.label === weatherName);
      return weatherOption ? weatherOption.icon : null;
    };

    const getActivityIcon = (activityName) => {
      // Check standard activities
      const activity = activities.find((a) => a.label === activityName);
      if (activity) return activity.icon;

      // Check custom activities from yesterday's mood data
      if (
        yesterdayMood.customActivities &&
        yesterdayMood.customActivities.length > 0
      ) {
        const customActivity = yesterdayMood.customActivities.find(
          (a) => a.label === activityName
        );
        if (customActivity) return customActivity.icon;
      }

      return null;
    };

    // Get display name for activity
    const getActivityDisplayName = (activityName) => {
      // Check standard activities
      const activity = activities.find((a) => a.label === activityName);
      if (activity) return activity.label;

      // Check custom activities from yesterday's mood data
      if (
        yesterdayMood.customActivities &&
        yesterdayMood.customActivities.length > 0
      ) {
        const customActivity = yesterdayMood.customActivities.find(
          (a) => a.label === activityName
        );
        if (customActivity) return customActivity.label;
      }

      return activityName;
    };

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>
          {isActuallyToday ? "Today's Mood" : "Yesterday's Mood"}
        </Text>
        <Text style={styles.summaryDate}>
          {formatYesterdayDate(new Date(yesterdayMood.date))}
        </Text>
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Morning: </Text>
            <Text style={styles.summaryValue}>{morningMoodData}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Evening: </Text>
            <Text style={styles.summaryValue}>{eveningMoodData}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Activities: </Text>
            <View style={styles.activitiesContainer}>
              {yesterdayMood.activities &&
              yesterdayMood.activities.length > 0 ? (
                yesterdayMood.activities.map((activity, index) => (
                  <View key={index} style={styles.activityRow}>
                    <Text style={styles.activityIcon}>
                      {getActivityIcon(activity)}
                    </Text>
                    <Text style={styles.activityText}>
                      {getActivityDisplayName(activity)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.summaryValue}>Not specified</Text>
              )}
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Weather: </Text>
            {yesterdayMood.weather ? (
              <>
                <Text style={styles.weatherIcon}>
                  {getWeatherIcon(yesterdayMood.weather)}
                </Text>
                <Text style={styles.summaryValue}>{yesterdayMood.weather}</Text>
              </>
            ) : (
              <Text style={styles.summaryValue}>Not specified</Text>
            )}
          </View>

          {yesterdayMood.notes ? (
            <View style={styles.notesSection}>
              <Text style={styles.summaryLabel}>Notes: </Text>
              <Text style={styles.notesValue}>{yesterdayMood.notes}</Text>
            </View>
          ) : (
            <View style={styles.notesSection}>
              <Text style={styles.summaryLabel}>Notes: </Text>
              <Text style={styles.notesValue}>Not specified</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {showMoodLogger ? (
        <MoodLogger
          onBack={() => setShowMoodLogger(false)}
          onCalendarPress={() => navigation.navigate("Calendar")}
          onLogMood={handleLogMood}
          morningMood={morningMood}
          setMorningMood={setMorningMood}
          eveningMood={eveningMood}
          setEveningMood={setEveningMood}
          selectedActivities={selectedActivities}
          toggleActivity={toggleActivity}
          selectedWeather={selectedWeather}
          setSelectedWeather={setSelectedWeather}
          notes={notes}
          setNotes={setNotes}
          formattedDate={formatDate()}
          isUpdating={hasSavedTodaysMood}
          customActivities={customActivities}
          onAddCustomActivity={addCustomActivity}
        />
      ) : (
        renderHomeContent()
      )}

      <MoodSummaryModal
        visible={showSummary}
        onClose={() => setShowSummary(false)}
        onSave={handleSave}
        dateString={formatDate()}
        morningMood={morningMood}
        eveningMood={eveningMood}
        selectedActivities={selectedActivities}
        selectedWeather={selectedWeather}
        notes={notes}
        isTodaysMood={true}
        isUpdating={hasSavedTodaysMood}
        previousMoodData={previousMoodData}
        customActivities={customActivities}
      />

      {/* Calendar Day MoodSummaryModal */}
      {calendarSelectedDay && (
        <MoodSummaryModal
          visible={showCalendarSummary}
          onClose={() => setShowCalendarSummary(false)}
          dateString={new Date(calendarSelectedDay.date).toLocaleDateString(
            undefined,
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
          morningMood={calendarSelectedDay.moods[0]}
          eveningMood={calendarSelectedDay.moods[1]}
          selectedActivities={calendarSelectedDay.activities || []}
          selectedWeather={calendarSelectedDay.weather}
          notes={calendarSelectedDay.notes || ""}
          isTodaysMood={calendarSelectedDay.date === formatDateISO(new Date())}
          isReadOnly={true}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: layout.container,
  contentContainer: layout.gradientContainer,
  header: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.regular,
    marginBottom: 24,
  },
  streakWrapper: {
    alignItems: "center",
    marginBottom: spacing.md,
    width: "100%",
  },
  streakSubtext: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  ctaButton: {
    ...buttons.primary,
    margin: 0,
    width: "100%",
  },
  ctaButtonText: {
    ...buttons.primaryText,
    textAlign: "center",
  },
  summaryContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    ...textStyles.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  summaryDate: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    fontStyle: "italic",
  },
  summaryContent: {
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...textStyles.body,
    fontWeight: "600",
    color: colors.text.secondary,
    minWidth: 80,
  },
  summaryValue: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
  },
  summarySection: {
    marginBottom: spacing.sm,
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
  weatherIcon: {
    fontSize: 20,
    marginRight: 8,
    width: 26,
    textAlign: "center",
  },
  notesSection: {
    marginTop: spacing.xs,
  },
  notesValue: {
    ...textStyles.body,
    color: colors.text.primary,
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
});
