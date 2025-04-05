import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View, StyleSheet, Image } from "react-native";

// Import screens
import CalendarScreen from "../screens/CalendarScreen";
import HomeScreen from "../screens/HomeScreen";
import StatsScreen from "../screens/StatsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#22c55e",
          tabBarInactiveTintColor: "gray",
          headerShown: true,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <View style={styles.headerContainer}>
                <Text style={styles.dateText}>{formatDate()}</Text>
              </View>
            ),
            headerLeft: () => (
              <View style={styles.logoContainer}>
                <MaterialCommunityIcons
                  name="brain"
                  size={30}
                  color="#22c55e"
                  style={styles.logo}
                />
              </View>
            ),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="calendar"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-bar"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  logoContainer: {
    marginLeft: 15,
  },
  logo: {
    width: 30,
    height: 30,
  },
  dateText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
});
