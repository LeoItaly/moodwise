import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import { LineChart, BarChart } from "react-native-gifted-charts";
import { Picker } from "@react-native-picker/picker";
import { sampleData } from "../data/sampleData";
import { activities } from "../data/activities";
import { weather } from "../data/weather";
import { LinearGradient } from "expo-linear-gradient";

export default function StatsScreen() {
  const [selectedData, setSelectedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Activity");

  // Days of week for x-axis labels
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Process data for line chart (mood over time)
  const moodOverTimeData = sampleData.slice(0, 7).map((item, index) => {
    const avgMood = (item.moods[0] + item.moods[1]) / 2;
    return {
      value: avgMood,
      label: daysOfWeek[index],
      dataPointText: avgMood.toFixed(1),
      date: item.date,
      morningMood: item.moods[0],
      eveningMood: item.moods[1],
    };
  });

  // Activity icons mapping
  const activityIcons = {
    Football: "⚽",
    Gymnastics: "🤸",
    Swimming: "🏊",
    Gym: "🏋️",
    Walking: "🚶",
    Badminton: "🏸",
    Handball: "🤾",
    Tennis: "🎾",
    Running: "🏃",
    Others: "🏋️‍♂️",
  };

  // Weather icons mapping
  const weatherIcons = {
    Sunny: "☀️",
    Cloudy: "☁️",
    Windy: "💨",
    Rainy: "🌧️",
    Snowy: "❄️",
  };

  // Process data for bar chart based on selected filter
  const getBarChartData = () => {
    if (selectedFilter === "Activity") {
      return activities.map((activity) => {
        const activityDays = sampleData.filter((day) =>
          day.activities.includes(activity.label)
        );
        const avgMood =
          activityDays.length > 0
            ? activityDays.reduce((sum, day) => {
                return sum + (day.moods[0] + day.moods[1]) / 2;
              }, 0) / activityDays.length
            : 0;

        const color =
          avgMood < 1 ? "#ef4444" : avgMood < 3 ? "#facc15" : "#22c55e";

        return {
          value: avgMood,
          label: activityIcons[activity.label],
          dataPointText: avgMood.toFixed(1),
          count: activityDays.length,
          frontColor: color,
          type: "Activity",
          name: activity.label,
        };
      });
    } else {
      return weather.map((weatherType) => {
        const weatherDays = sampleData.filter(
          (day) => day.weather === weatherType.label
        );
        const avgMood =
          weatherDays.length > 0
            ? weatherDays.reduce((sum, day) => {
                return sum + (day.moods[0] + day.moods[1]) / 2;
              }, 0) / weatherDays.length
            : 0;

        const color =
          avgMood < 1 ? "#ef4444" : avgMood < 3 ? "#facc15" : "#22c55e";

        return {
          value: avgMood,
          label: weatherIcons[weatherType.label],
          dataPointText: avgMood.toFixed(1),
          count: weatherDays.length,
          frontColor: color,
          type: "Weather",
          name: weatherType.label,
        };
      });
    }
  };

  const renderTooltip = (data) => {
    if (!data) return null;

    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipTitle}>
          {data.date ? "Date: " + data.date : `${data.type}: ${data.name}`}
        </Text>
        {data.date ? (
          <>
            <Text style={styles.tooltipText}>
              Morning Mood: {data.morningMood}
            </Text>
            <Text style={styles.tooltipText}>
              Evening Mood: {data.eveningMood}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.tooltipText}>
              Average Mood: {data.value.toFixed(1)}
            </Text>
            <Text style={styles.tooltipText}>Times Logged: {data.count}</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#ffffff", "#f0f9ff", "#ffffff"]}
        style={styles.chartContainer}
      >
        <Text style={styles.chartTitle}>Mood Over Time</Text>
        <LineChart
          data={moodOverTimeData}
          height={250}
          spacing={40}
          initialSpacing={20}
          color="#3b82f6"
          thickness={3}
          startFillColor="#3b82f6"
          endFillColor="#60a5fa"
          startOpacity={0.9}
          endOpacity={0.2}
          backgroundColor="transparent"
          xAxisColor="#94a3b8"
          yAxisColor="#94a3b8"
          yAxisTextStyle={{ color: "#64748b", fontWeight: "500" }}
          xAxisLabelTextStyle={{ color: "#64748b", fontWeight: "500" }}
          hideRules
          minValue={0}
          maxValue={4}
          stepValue={1}
          onPress={(data) => {
            setSelectedData(data);
            setModalVisible(true);
          }}
        />
      </LinearGradient>

      <LinearGradient
        colors={["#ffffff", "#f0f9ff", "#ffffff"]}
        style={styles.chartContainer}
      >
        <View style={styles.filterContainer}>
          <Text style={styles.chartTitle}>Mood by </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFilter}
              onValueChange={(value) => setSelectedFilter(value)}
              style={styles.picker}
              dropdownIconColor="#64748b"
            >
              <Picker.Item label="Activity" value="Activity" />
              <Picker.Item label="Weather" value="Weather" />
            </Picker>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.barChartScrollContainer}
        >
          <BarChart
            data={getBarChartData()}
            height={250}
            width={600}
            spacing={40}
            initialSpacing={10}
            barWidth={30}
            noOfSections={4}
            barBorderRadius={6}
            backgroundColor="transparent"
            xAxisColor="#94a3b8"
            yAxisColor="#94a3b8"
            yAxisTextStyle={{ color: "#64748b", fontWeight: "500" }}
            xAxisLabelTextStyle={{
              color: "#64748b",
              fontSize: 12,
              fontWeight: "500",
            }}
            hideRules
            minValue={0}
            maxValue={4}
            stepValue={1}
            onPress={(data) => {
              setSelectedData(data);
              setModalVisible(true);
            }}
          />
        </ScrollView>
      </LinearGradient>

      {/* Modal for Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderTooltip(selectedData)}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  chartContainer: {
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "visible",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  picker: {
    width: 150,
    height: Platform.OS === "ios" ? 200 : 55,
    color: "#64748b",
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tooltip: {
    padding: 12,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  tooltipText: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 6,
  },
  closeButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  barChartScrollContainer: {
    paddingRight: 20,
  },
});
