// In-memory storage (for demo purposes)
import { sampleData } from "../data/appData";

let inMemoryStorage = {
  moodData: [],
  customActivities: [],
  hiddenActivities: [],
};

// Generate mock consecutive days for demo streak
const generateConsecutiveDaysData = () => {
  // Only generate if storage is empty
  if (inMemoryStorage.moodData.length === 0) {
    // Instead of generating random data, use the predefined sample data with varied activities and weather
    inMemoryStorage.moodData = [...sampleData];

    // Match the dates to current relative dates if needed
    const today = new Date();

    // Update dates to be relative to today
    inMemoryStorage.moodData = inMemoryStorage.moodData.map((entry, index) => {
      const date = new Date();
      date.setDate(today.getDate() - index);
      return {
        ...entry,
        date: formatDateISO(date),
      };
    });
  }
};

// Helper function to format date as YYYY-MM-DD
const formatDateISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Save all mood data
export const saveMoodData = async (moodData) => {
  try {
    inMemoryStorage.moodData = moodData;
    console.log("Saved mood data in memory");
    return true;
  } catch (error) {
    console.error("Error saving mood data:", error);
    return false;
  }
};

// Load all mood data
export const loadMoodData = async () => {
  try {
    // For demo purposes, generate consecutive days data if needed
    generateConsecutiveDaysData();
    return inMemoryStorage.moodData;
  } catch (error) {
    console.error("Error loading mood data:", error);
    return [];
  }
};

// Save custom activities
export const saveCustomActivities = async (customActivities) => {
  try {
    inMemoryStorage.customActivities = customActivities;
    console.log("Saved custom activities in memory");
    return true;
  } catch (error) {
    console.error("Error saving custom activities:", error);
    return false;
  }
};

// Load custom activities
export const loadCustomActivities = async () => {
  try {
    return inMemoryStorage.customActivities;
  } catch (error) {
    console.error("Error loading custom activities:", error);
    return [];
  }
};

// Calculate current streak of consecutive days with mood logs
export const calculateStreak = (moodData) => {
  if (!moodData || moodData.length === 0) {
    return 0;
  }

  // Sort mood data by date (newest first)
  const sortedData = [...moodData].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Get today's date in the same format as mood data (YYYY-MM-DD)
  const today = new Date();
  const formattedToday = formatDateISO(today);

  // For demo purposes - check if we have our 31-day streak setup
  const isDemoData =
    moodData.length >= 31 &&
    sortedData.findIndex((entry) => entry.date === formattedToday) !== -1;
  if (isDemoData) {
    // If the newest entry is today's entry in our demo data, return 32
    // otherwise return 31 (our starting value)
    const hasLoggedToday = sortedData[0].date === formattedToday;
    if (hasLoggedToday) {
      return 32; // Logged today on demo data, so 31+1
    } else {
      return 31; // Haven't logged today yet on demo data
    }
  }

  // Normal streak calculation logic for non-demo data
  // Check if user has logged mood today
  const hasLoggedToday = sortedData[0].date === formattedToday;

  // If not logged today, start checking from yesterday
  const startDate = hasLoggedToday
    ? today
    : new Date(today.setDate(today.getDate() - 1));
  let currentDate = new Date(startDate);
  let streak = 0;

  // Iterate through potential consecutive days
  for (
    let i = hasLoggedToday ? 0 : 1;
    i < sortedData.length + (hasLoggedToday ? 0 : 1);
    i++
  ) {
    const expectedDate = formatDateISO(currentDate);

    // If we have a mood entry for the expected date, increment streak
    if (i < sortedData.length && sortedData[i].date === expectedDate) {
      streak++;
      // Move to the previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // Break the streak when we find a gap
      break;
    }
  }

  return streak;
};

// Save hidden default activities
export const saveHiddenActivities = async (hiddenActivities) => {
  try {
    inMemoryStorage.hiddenActivities = hiddenActivities;
    console.log("Saved hidden activities in memory");
    return true;
  } catch (error) {
    console.error("Error saving hidden activities:", error);
    return false;
  }
};

// Load hidden default activities
export const loadHiddenActivities = async () => {
  try {
    return inMemoryStorage.hiddenActivities;
  } catch (error) {
    console.error("Error loading hidden activities:", error);
    return [];
  }
};
