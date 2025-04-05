// Typography constants
export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },

  // Font weights
  fontWeight: {
    regular: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
  },
};

// Text style presets
export const textStyles = {
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
  },

  subtitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
  },

  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
  },

  body: {
    fontSize: typography.fontSize.md,
  },

  caption: {
    fontSize: typography.fontSize.sm,
  },

  small: {
    fontSize: typography.fontSize.xs,
  },
};
