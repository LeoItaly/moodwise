import { Frown, Meh, SmilePlus, Smile, Heart } from "lucide-react-native";

// Weather data
export const weather = [
  { label: "Sunny", icon: "☀️" },
  { label: "Cloudy", icon: "☁️" },
  { label: "Windy", icon: "💨" },
  { label: "Rainy", icon: "🌧️" },
  { label: "Snowy", icon: "❄️" },
];

// Weather options for settings/forms
export const weatherOptions = [
  { value: "sunny", label: "Sunny" },
  { value: "cloudy", label: "Cloudy" },
  { value: "rainy", label: "Rainy" },
  { value: "stormy", label: "Stormy" },
  { value: "snowy", label: "Snowy" },
];

// Mood icons
export const moodIcons = [
  { id: 1, emoji: "😢", label: "Sad", color: "#ef4444" },
  { id: 2, emoji: "😕", label: "Down", color: "#f97316" },
  { id: 3, emoji: "😐", label: "Neutral", color: "#facc15" },
  { id: 4, emoji: "🙂", label: "Good", color: "#84cc16" },
  { id: 5, emoji: "😊", label: "Great", color: "#22c55e" },
];

// Activities
export const activities = [
  { label: "Football", icon: "⚽" },
  { label: "Gymnastics", icon: "🤸" },
  { label: "Swimming", icon: "🏊" },
  { label: "Gym", icon: "🏋️" },
  { label: "Walking", icon: "🚶" },
  { label: "Badminton", icon: "🏸" },
  { label: "Handball", icon: "🤾" },
  { label: "Tennis", icon: "🎾" },
  { label: "Running", icon: "🏃" },
  { label: "Cycling", icon: "🚴" },
  { label: "Yoga", icon: "🧘" },
];

// Sample data
export const sampleData = [
  {
    date: "2025-03-31",
    moods: [3, 4], // morning and evening moods
    activities: ["Walking", "Gym"],
    weather: "Sunny",
    notes:
      "Felt energetic today! Started with a nice walk and ended with a productive gym session.",
  },
  {
    date: "2025-03-30",
    moods: [2, 3],
    activities: ["Swimming"],
    weather: "Cloudy",
    notes: "Woke up feeling a bit tired, but swimming helped improve my mood.",
  },
  {
    date: "2025-03-29",
    moods: [1, 2],
    activities: ["Running"],
    weather: "Rainy",
    notes: "Difficult day overall. The rain made my run challenging.",
  },
  {
    date: "2025-03-28",
    moods: [0, 1],
    activities: [],
    weather: "Windy",
    notes:
      "Feeling very low today. The windy weather made it worse and I didn't feel like doing any activities.",
  },
  {
    date: "2025-03-27",
    moods: [4, 4],
    activities: ["Football", "Gym"],
    weather: "Sunny",
    notes: "Perfect day! Football match was great and had an amazing workout.",
  },
  {
    date: "2025-03-26",
    moods: [3, 3],
    activities: ["Walking", "Tennis"],
    weather: "Cloudy",
    notes: "Consistent good mood throughout the day. Tennis was fun!",
  },
  {
    date: "2025-03-25",
    moods: [2, 2],
    activities: ["Swimming"],
    weather: "Rainy",
    notes:
      "Feeling neutral. Swimming indoors was a good choice on a rainy day.",
  },
  {
    date: "2025-03-24",
    moods: [4, 4],
    activities: ["Cycling", "Swimming"],
    weather: "Sunny",
    notes:
      "Had a wonderful bike ride in the morning and then a refreshing swim.",
  },
  {
    date: "2025-03-23",
    moods: [3, 3],
    activities: ["Gym", "Yoga"],
    weather: "Sunny",
    notes: "Productive workout followed by relaxing yoga session.",
  },
  {
    date: "2025-03-22",
    moods: [1, 2],
    activities: ["Rest"],
    weather: "Rainy",
    notes: "Took it easy today. The rainy day affected my mood negatively.",
  },
  {
    date: "2025-03-21",
    moods: [2, 3],
    activities: ["Walking"],
    weather: "Cloudy",
    notes: "Started with an average mood but the walk helped me feel better.",
  },
  {
    date: "2025-03-20",
    moods: [3, 4],
    activities: ["Running", "Gym"],
    weather: "Sunny",
    notes: "Spring equinox! The nice weather and exercise boosted my mood.",
  },
  {
    date: "2025-03-19",
    moods: [4, 4],
    activities: ["Swimming", "Yoga"],
    weather: "Sunny",
    notes: "Perfect Sunday - swimming and yoga are my favorite combination.",
  },
  {
    date: "2025-03-18",
    moods: [2, 2],
    activities: ["Rest"],
    weather: "Rainy",
    notes: "Weekend but rainy, so I decided to stay home and rest.",
  },
  {
    date: "2025-03-17",
    moods: [3, 4],
    activities: ["Walking", "Tennis"],
    weather: "Cloudy",
    notes: "St. Patrick's Day! Had a nice walk and played tennis with friends.",
  },
  {
    date: "2025-03-16",
    moods: [2, 3],
    activities: ["Cycling"],
    weather: "Cloudy",
    notes: "Bike ride after work improved my mood significantly.",
  },
  {
    date: "2025-03-15",
    moods: [1, 2],
    activities: ["Gym"],
    weather: "Rainy",
    notes: "Feeling a bit down today, but the gym helped a little.",
  },
  {
    date: "2025-03-14",
    moods: [3, 3],
    activities: ["Running", "Yoga"],
    weather: "Sunny",
    notes: "Pi Day! Celebrated with a nice run and yoga session.",
  },
  {
    date: "2025-03-13",
    moods: [2, 1],
    activities: [],
    weather: "Windy",
    notes: "Monday blues hit hard. Windy day made it worse.",
  },
  {
    date: "2025-03-12",
    moods: [4, 3],
    activities: ["Swimming", "Walking"],
    weather: "Sunny",
    notes:
      "Great Sunday! Started with a morning swim and ended with a sunset walk.",
  },
  {
    date: "2025-03-11",
    moods: [3, 4],
    activities: ["Football", "Gym"],
    weather: "Sunny",
    notes: "Played a great football match and had an energizing gym session.",
  },
  {
    date: "2025-03-10",
    moods: [2, 3],
    activities: ["Walking"],
    weather: "Cloudy",
    notes: "Average day, but the walk helped clear my mind.",
  },
  {
    date: "2025-03-09",
    moods: [1, 2],
    activities: ["Gym"],
    weather: "Rainy",
    notes:
      "The rain and workload affected my mood, but the gym session helped a bit.",
  },
  {
    date: "2025-03-08",
    moods: [3, 4],
    activities: ["Yoga", "Swimming"],
    weather: "Sunny",
    notes: "International Women's Day! Celebrated with self-care activities.",
  },
  {
    date: "2025-03-07",
    moods: [2, 2],
    activities: ["Running"],
    weather: "Windy",
    notes: "Neutral day. The run was challenging due to the wind.",
  },
  {
    date: "2025-03-06",
    moods: [0, 1],
    activities: [],
    weather: "Rainy",
    notes: "Very difficult day. The rain and Monday made it worse.",
  },
  {
    date: "2025-03-05",
    moods: [4, 3],
    activities: ["Cycling", "Yoga"],
    weather: "Sunny",
    notes: "Wonderful Sunday with outdoor cycling and relaxing yoga.",
  },
  {
    date: "2025-03-04",
    moods: [3, 4],
    activities: ["Tennis", "Swimming"],
    weather: "Sunny",
    notes: "Great Saturday with outdoor activities and sports.",
  },
  {
    date: "2025-03-03",
    moods: [2, 3],
    activities: ["Gym"],
    weather: "Cloudy",
    notes: "Average mood improved after a good workout.",
  },
  {
    date: "2025-03-02",
    moods: [3, 2],
    activities: ["Walking"],
    weather: "Windy",
    notes: "Started well but the windy afternoon brought my mood down.",
  },
  {
    date: "2025-03-01",
    moods: [3, 3],
    activities: ["Running", "Yoga"],
    weather: "Sunny",
    notes:
      "Great start to the month with balanced activities and good weather.",
  },
];
