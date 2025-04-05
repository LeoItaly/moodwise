import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { activities } from "../data/appData";
import CustomActivityModal from "./CustomActivityModal";

const ActivitySelector = ({
  selectedActivities,
  onToggleActivity,
  customActivities = [],
  onAddCustomActivity,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Combine default activities with custom activities
  const allActivities = [...activities];

  // Add custom activities to the display list
  if (customActivities && customActivities.length > 0) {
    customActivities.forEach((customActivity) => {
      allActivities.push({
        label: customActivity.label,
        icon: customActivity.icon,
        isCustom: true,
      });
    });
  }

  const handleAddCustomActivity = (customActivity) => {
    if (onAddCustomActivity) {
      onAddCustomActivity(customActivity);
    }
    setShowCustomModal(false);
  };

  return (
    <>
      <View style={styles.iconGrid}>
        {allActivities.map((activity) => (
          <TouchableOpacity
            key={activity.label}
            style={[
              styles.iconButton,
              selectedActivities.includes(activity.label) &&
                styles.selectedIcon,
            ]}
            onPress={() => onToggleActivity(activity.label)}
          >
            <Text style={styles.iconText}>{activity.icon}</Text>
          </TouchableOpacity>
        ))}

        {/* Custom activity button with plus icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowCustomModal(true)}
        >
          <Text style={styles.iconText}>➕</Text>
        </TouchableOpacity>
      </View>

      <CustomActivityModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSave={handleAddCustomActivity}
      />
    </>
  );
};

const styles = StyleSheet.create({
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
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
});

export default ActivitySelector;
