import { colors } from "../constants";

// Mood color mapping
export const moodColors = {
  0: colors.mood.awful,
  1: colors.mood.bad,
  2: colors.mood.neutral,
  3: colors.mood.good,
  4: colors.mood.great,
};

/**
 * Get color based on mood value
 * @param {number} moodValue - Mood value (0-4)
 * @returns {string} - Color hex code
 */
export const getMoodColor = (moodValue) => {
  if (moodValue < 1) return colors.mood.awful;
  if (moodValue < 2) return colors.mood.bad;
  if (moodValue < 3) return colors.mood.neutral;
  if (moodValue < 4) return colors.mood.good;
  return colors.mood.great;
};

/**
 * Get emoji for mood value
 * @param {number} moodValue - Mood value (0-4)
 * @returns {string} - Emoji representing the mood
 */
export const getMoodEmoji = (moodValue) => {
  if (moodValue < 1) return "😣";
  if (moodValue < 2) return "😔";
  if (moodValue < 3) return "😐";
  if (moodValue < 4) return "🙂";
  return "😄";
};

/**
 * Get mood label based on value
 * @param {number} moodValue - Mood value (0-4)
 * @returns {string} - Textual label for the mood
 */
export const getMoodLabel = (moodValue) => {
  if (moodValue === null || moodValue === undefined) {
    return "Not specified";
  }

  switch (moodValue) {
    case 0:
      return "Awful";
    case 1:
      return "Bad";
    case 2:
      return "Neutral";
    case 3:
      return "Good";
    case 4:
      return "Great";
    default:
      return "Not specified";
  }
};
