import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SettingItem from "../components/SettingItem";
import {
  colors,
  layout,
  spacing,
  buttons,
  textStyles,
  typography,
} from "../constants";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[colors.white, colors.background.secondary, colors.white]}
        style={styles.contentContainer}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            title="Notifications"
            description="Receive reminders to log your mood"
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingItem
            title="Dark Mode"
            description="Coming soon"
            value={darkMode}
            onValueChange={setDarkMode}
            disabled={true}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Export Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.dangerButton]}>
            <Text style={styles.buttonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
  dangerButton: {
    backgroundColor: colors.background.danger,
  },
  buttonText: {
    fontSize: textStyles.body.fontSize,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    textAlign: "center",
  },
});
