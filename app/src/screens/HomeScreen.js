import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PieChart } from "react-native-gifted-charts";
import { sampleData } from "../data/sampleData";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart3 } from "lucide-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { moodIcons } from "../data/moodIcons";

const getMoodColor = (avgMood) => {
  if (avgMood < 1) return "#ef4444"; // red
  if (avgMood < 2) return "#f97316"; // orange
  if (avgMood < 3) return "#facc15"; // yellow
  if (avgMood < 4) return "#84cc16"; // light green
  return "#22c55e"; // green
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(null);
  const pulseAnim = new Animated.Value(1);
  const buttonPulseAnim = new Animated.Value(1);
  const last14Days = sampleData.slice(-14);

  useEffect(() => {
    // Start pulsing animation for pie chart
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start pulsing animation for button
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Calculate mood distribution for pie chart
  const moodCounts = {
    0: 0, // awful
    1: 0, // bad
    2: 0, // meh
    3: 0, // good
    4: 0, // radiant
  };

  // Count all moods (both morning and evening)
  sampleData.forEach((day) => {
    day.moods.forEach((mood) => {
      moodCounts[mood]++;
    });
  });

  // Convert mood counts to pie chart data
  const pieData = [
    {
      value: moodCounts[0],
      color: "#ef4444",
      focused: selectedMoodIndex === 0,
      label: "Awful",
    },
    {
      value: moodCounts[1],
      color: "#f97316",
      focused: selectedMoodIndex === 1,
      label: "Bad",
    },
    {
      value: moodCounts[2],
      color: "#facc15",
      focused: selectedMoodIndex === 2,
      label: "Meh",
    },
    {
      value: moodCounts[3],
      color: "#84cc16",
      focused: selectedMoodIndex === 3,
      label: "Good",
    },
    {
      value: moodCounts[4],
      color: "#22c55e",
      focused: selectedMoodIndex === 4,
      label: "Radiant",
    },
  ];

  const handlePiePress = (index) => {
    setSelectedMoodIndex(index);
  };

  const renderMoodBreakdown = () => {
    return (
      <View style={styles.moodBreakdown}>
        <Text style={styles.breakdownTitle}>Total Logs</Text>
        <View style={styles.moodGrid}>
          {moodIcons.map((mood, index) => {
            const count = moodCounts[mood.id - 1];
            if (count === 0) return null;

            return (
              <View key={mood.id} style={styles.moodItem}>
                <View
                  style={[
                    styles.moodEmojiContainer,
                    selectedMoodIndex === index && {
                      backgroundColor: mood.color,
                    },
                  ]}
                >
                  <Text style={[styles.moodEmoji, { fontSize: 24 }]}>
                    {mood.emoji}
                  </Text>
                </View>
                <Text style={[styles.moodCount, { color: mood.color }]}>
                  {count}
                </Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#ffffff", "#f0f9ff", "#ffffff"]}
        style={styles.contentContainer}
      >
        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: buttonPulseAnim }] }}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate("Mood")}
            >
              <Text style={styles.ctaButtonText}>Log Your Mood</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.sectionTitle}>Recent Moods</Text>
            <TouchableOpacity
              style={styles.calendarIcon}
              onPress={() => navigation.navigate("Calendar")}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color="#4CAF50"
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={last14Days}
            renderItem={({ item }) => {
              const avgMood = (item.moods[0] + item.moods[1]) / 2;
              const color = getMoodColor(avgMood);
              return (
                <TouchableOpacity
                  style={[styles.dayBubble, { backgroundColor: color }]}
                  onPress={() => navigation.navigate("Calendar")}
                >
                  <Text style={styles.dayText}>
                    {new Date(item.date).getDate()}
                  </Text>
                </TouchableOpacity>
              );
            }}
            numColumns={7}
            keyExtractor={(item) => item.date}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Mood Distribution</Text>
            <TouchableOpacity
              style={styles.chartIcon}
              onPress={() => navigation.navigate("Stats")}
            >
              <BarChart3 size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          <View style={styles.pieChartContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <PieChart
                data={pieData}
                donut
                showText
                textColor="#1e293b"
                radius={120}
                innerRadius={60}
                textSize={12}
                focusOnPress
                onPress={(item, index) => handlePiePress(index)}
                centerLabelComponent={() => {
                  return (
                    <View style={styles.centerLabel}>
                      <Text style={styles.centerLabelText}>
                        {Object.values(moodCounts).reduce((a, b) => a + b, 0)}
                      </Text>
                      <Text style={styles.centerLabelSubtext}>Total Logs</Text>
                    </View>
                  );
                }}
              />
            </Animated.View>
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>Tap to highlight mood</Text>
              <View style={styles.hintArrow} />
            </View>
          </View>
          {renderMoodBreakdown()}
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  calendarContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarIcon: {
    padding: 8,
  },
  dayBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dayText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartIcon: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 16,
    marginLeft: 4,
  },
  pieChartContainer: {
    alignItems: "center",
  },
  centerLabel: {
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  centerLabelSubtext: {
    fontSize: 14,
    color: "#64748b",
  },
  moodBreakdown: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 16,
    textAlign: "center",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  moodItem: {
    alignItems: "center",
    minWidth: 80,
  },
  moodCount: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  moodEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  moodEmoji: {
    fontSize: 24,
  },
  hintContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  hintText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  hintArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#64748b",
  },
});
