import { colors } from "./colors";
import { spacing, borderRadius } from "./spacing";
import { typography } from "./typography";

// Common button styles
export const buttons = {
  // Primary button
  primary: {
    backgroundColor: colors.brand.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    margin: spacing.lg,
  },

  // Primary button text
  primaryText: {
    color: colors.text.light,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },

  // Secondary button
  secondary: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    margin: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },

  // Secondary button text
  secondaryText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },

  // Danger button
  danger: {
    backgroundColor: colors.background.danger,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    margin: spacing.sm,
  },

  // Close button
  close: {
    backgroundColor: colors.brand.secondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },

  // Close button text
  closeText: {
    color: colors.text.light,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },

  // Icon button
  icon: {
    padding: spacing.sm,
  },

  // Mood button
  mood: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  // Selected mood button
  selectedMood: {
    transform: [{ scale: 1.4 }],
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};
