import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

const SettingItem = ({
  title,
  description,
  value,
  onValueChange,
  disabled,
}) => (
  <View style={styles.settingItem}>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
      {description && (
        <Text style={styles.settingDescription}>{description}</Text>
      )}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: "#e2e8f0", true: "#4CAF50" }}
      thumbColor={value ? "#ffffff" : "#f4f4f5"}
    />
  </View>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#64748b",
  },
});

export default SettingItem;
