import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Flame, Crown } from "lucide-react-native";
import {
  colors,
  layout,
  spacing,
  textStyles,
  borderRadius,
} from "../constants";

const StreakDisplay = ({
  streak,
  size = "medium",
  animated = false,
  scaleAnim = null,
}) => {
  // Use a number value for the streak
  const displayStreak = typeof streak === "number" ? streak : 0;
  const isMonthlyStreak = displayStreak >= 30;

  // Determine sizes based on the size prop
  const getSizes = () => {
    switch (size) {
      case "small":
        return {
          container: 70,
          badge: 44, // Increased for better visibility
          icon: 16,
          countSize: 20, // Increased from 16
          labelSize: 12,
        };
      case "large":
        return {
          container: 120,
          badge: 90, // Increased for better visibility
          icon: 24,
          countSize: 42, // Increased from 32
          labelSize: 18,
        };
      case "medium":
      default:
        return {
          container: 90,
          badge: 70, // Increased for better visibility
          icon: 20,
          countSize: 32, // Increased from 24
          labelSize: 14,
        };
    }
  };

  const sizes = getSizes();

  // Determine if UI should be minimal (for small size)
  const isMinimal = size === "small";

  // Determine badge color based on streak
  const getBadgeColor = () => {
    if (displayStreak >= 30) return "#ff6b6b"; // Red for 30+ days
    if (displayStreak >= 14) return "#ffa94d"; // Orange for 14+ days
    if (displayStreak >= 7) return "#f1c40f"; // Yellow for 7+ days
    if (displayStreak >= 3) return "#74c0fc"; // Blue for 3+ days
    return colors.primary; // Default color
  };

  return (
    <View style={[styles.container, { width: sizes.container }]}>
      {/* Crown for monthly streak */}
      {isMonthlyStreak && (
        <View style={styles.crownContainer}>
          <Crown
            size={sizes.icon * 1.5}
            color="#FFD700"
            style={styles.crownIcon}
          />
        </View>
      )}

      <View
        style={[
          styles.badge,
          {
            width: sizes.badge,
            height: sizes.badge,
            backgroundColor: getBadgeColor(),
            borderColor: isMonthlyStreak
              ? "rgba(255, 215, 0, 0.5)"
              : "rgba(255, 255, 255, 0.3)",
            borderWidth: isMonthlyStreak ? 3 : 2,
          },
        ]}
      >
        {/* The streak number - positioned absolutely for consistent centering */}
        <View style={styles.countContainer}>
          {animated && scaleAnim ? (
            <Animated.Text
              style={[
                styles.count,
                {
                  fontSize: sizes.countSize,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {displayStreak}
            </Animated.Text>
          ) : (
            <Text style={[styles.count, { fontSize: sizes.countSize }]}>
              {displayStreak}
            </Text>
          )}
        </View>

        {/* Add flame icon for 7-29 day streaks */}
        {displayStreak >= 7 && !isMonthlyStreak && (
          <View style={styles.flameContainer}>
            <Flame
              size={sizes.icon}
              color="rgba(255, 255, 255, 0.8)"
              style={styles.flameIcon}
            />
          </View>
        )}
      </View>

      <View style={styles.labelContainer}>
        {!isMinimal ? (
          <>
            <Text style={[styles.label, { fontSize: sizes.labelSize }]}>
              Day{displayStreak !== 1 ? "s" : ""}
            </Text>

            {isMonthlyStreak && (
              <Text style={styles.monthlyText}>Month+ Achievement!</Text>
            )}
          </>
        ) : (
          <Text style={[styles.label, { fontSize: sizes.labelSize }]}>
            Day{displayStreak !== 1 ? "s" : ""}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15, // Add space for crown
  },
  badge: {
    borderRadius: 50, // Make it circular
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: spacing.xs,
  },
  count: {
    fontWeight: "bold",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
    letterSpacing: -0.5, // Tighten spacing for numbers
    zIndex: 5, // Ensure text is above other elements
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  countContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  labelContainer: {
    alignItems: "center",
    marginTop: spacing.xs,
  },
  label: {
    color: colors.text.primary,
    fontWeight: "600",
    textAlign: "center",
  },
  flameContainer: {
    position: "absolute",
    top: -8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  flameIcon: {
    transform: [{ rotate: "15deg" }],
  },
  crownContainer: {
    position: "absolute",
    top: -5,
    zIndex: 10,
  },
  crownIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  monthlyText: {
    ...textStyles.small,
    color: "#FFD700",
    fontWeight: "700",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    textAlign: "center",
  },
});

export default StreakDisplay;
