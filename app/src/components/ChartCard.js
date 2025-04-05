import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ChartCard = ({ title, children }) => {
  return (
    <LinearGradient
      colors={["#ffffff", "#f0f9ff", "#ffffff"]}
      style={styles.chartContainer}
    >
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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
  chartTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 16,
  },
});

export default ChartCard; 