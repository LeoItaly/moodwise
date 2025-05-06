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
    date: "2025-05-06",
    moods: [4, 5],
    activities: ["Running", "Yoga"],
    weather: "Sunny",
    notes:
      "Perfect day! Morning run and evening yoga session really boosted my spirits.",
  },
  {
    date: "2025-05-05",
    moods: [3, 4],
    activities: ["Cycling", "Swimming"],
    weather: "Cloudy",
    notes:
      "Started neutral but the swim in the afternoon really improved my mood.",
  },
  {
    date: "2025-05-04",
    moods: [2, 3],
    activities: ["Walking", "Tennis"],
    weather: "Windy",
    notes:
      "Challenging walk due to the wind, but tennis indoors helped my mood improve.",
  },
  {
    date: "2025-05-03",
    moods: [4, 3],
    activities: ["Football", "Badminton"],
    weather: "Sunny",
    notes: "Great football match in the morning but got tired by evening.",
  },
  {
    date: "2025-05-02",
    moods: [3, 4],
    activities: ["Gym", "Handball"],
    weather: "Rainy",
    notes:
      "Productive workout and fun handball session despite the rainy weather.",
  },
  {
    date: "2025-05-01",
    moods: [5, 4],
    activities: ["Gymnastics", "Walking"],
    weather: "Sunny",
    notes:
      "May Day celebration with morning gymnastics and a lovely evening walk.",
  },
  {
    date: "2025-04-30",
    moods: [3, 4], // morning and evening moods
    activities: ["Walking", "Gym"],
    weather: "Sunny",
    notes:
      "Felt energetic today! Started with a nice walk and ended with a productive gym session.",
  },
  {
    date: "2025-04-29",
    moods: [2, 3],
    activities: ["Swimming", "Yoga"],
    weather: "Cloudy",
    notes:
      "Woke up feeling a bit tired, but swimming and yoga helped improve my mood.",
  },
  {
    date: "2025-04-28",
    moods: [1, 2],
    activities: ["Running", "Badminton"],
    weather: "Rainy",
    notes:
      "Difficult day overall. The rain made my run challenging, but badminton indoors was fun.",
  },
  {
    date: "2025-04-27",
    moods: [0, 1],
    activities: [],
    weather: "Windy",
    notes:
      "Feeling very low today. The windy weather made it worse and I didn't feel like doing any activities.",
  },
  {
    date: "2025-04-26",
    moods: [4, 4],
    activities: ["Football", "Handball"],
    weather: "Sunny",
    notes:
      "Perfect day! Football match was great and tried handball for the first time.",
  },
  {
    date: "2025-04-25",
    moods: [3, 3],
    activities: ["Tennis", "Cycling"],
    weather: "Cloudy",
    notes:
      "Consistent good mood throughout the day. Tennis and cycling were fun!",
  },
  {
    date: "2025-04-24",
    moods: [2, 2],
    activities: ["Swimming", "Gymnastics"],
    weather: "Rainy",
    notes:
      "Feeling neutral. Swimming indoors was a good choice on a rainy day. Tried gymnastics too.",
  },
  {
    date: "2025-04-23",
    moods: [4, 4],
    activities: ["Cycling", "Swimming"],
    weather: "Sunny",
    notes:
      "Had a wonderful bike ride in the morning and then a refreshing swim.",
  },
  {
    date: "2025-04-22",
    moods: [3, 3],
    activities: ["Gym", "Yoga"],
    weather: "Snowy",
    notes:
      "Productive workout followed by relaxing yoga session. Snowy day outside.",
  },
  {
    date: "2025-04-21",
    moods: [1, 2],
    activities: ["Rest"],
    weather: "Rainy",
    notes: "Took it easy today. The rainy day affected my mood negatively.",
  },
  {
    date: "2025-04-20",
    moods: [2, 3],
    activities: ["Walking", "Badminton"],
    weather: "Cloudy",
    notes:
      "Started with an average mood but the walk and badminton helped me feel better.",
  },
  {
    date: "2025-04-19",
    moods: [3, 4],
    activities: ["Running", "Tennis"],
    weather: "Sunny",
    notes: "Spring weather and exercise boosted my mood.",
  },
  {
    date: "2025-04-18",
    moods: [4, 4],
    activities: ["Swimming", "Yoga"],
    weather: "Windy",
    notes:
      "Perfect Sunday - swimming and yoga are my favorite combination despite the wind.",
  },
  {
    date: "2025-04-17",
    moods: [2, 2],
    activities: ["Rest"],
    weather: "Snowy",
    notes: "Weekend but snowy, so I decided to stay home and rest.",
  },
  {
    date: "2025-04-16",
    moods: [3, 4],
    activities: ["Walking", "Handball"],
    weather: "Windy",
    notes: "Had a nice walk and played handball with friends.",
  },
  {
    date: "2025-04-15",
    moods: [2, 3],
    activities: ["Cycling", "Gymnastics"],
    weather: "Cloudy",
    notes:
      "Bike ride after work improved my mood significantly. Tried gymnastics class.",
  },
  {
    date: "2025-04-14",
    moods: [1, 2],
    activities: ["Gym", "Football"],
    weather: "Rainy",
    notes:
      "Feeling a bit down today, but the gym and football helped a little.",
  },
  {
    date: "2025-04-13",
    moods: [3, 3],
    activities: ["Running", "Badminton"],
    weather: "Sunny",
    notes: "Great day! Had a nice run and badminton session.",
  },
  {
    date: "2025-04-12",
    moods: [2, 1],
    activities: ["Swimming"],
    weather: "Snowy",
    notes:
      "Monday blues hit hard. Snowy day made it worse but swimming helped a bit.",
  },
  {
    date: "2025-04-11",
    moods: [4, 3],
    activities: ["Tennis", "Walking"],
    weather: "Sunny",
    notes:
      "Great Sunday! Started with a tennis match and ended with a sunset walk.",
  },
  {
    date: "2025-04-10",
    moods: [3, 4],
    activities: ["Football", "Handball"],
    weather: "Cloudy",
    notes: "Played a great football match and tried handball with friends.",
  },
  {
    date: "2025-04-09",
    moods: [2, 3],
    activities: ["Walking", "Yoga"],
    weather: "Windy",
    notes:
      "Average day, but the walk and yoga helped clear my mind despite the wind.",
  },
  {
    date: "2025-04-08",
    moods: [1, 2],
    activities: ["Gym", "Badminton"],
    weather: "Rainy",
    notes:
      "The rain and workload affected my mood, but the gym and badminton sessions helped a bit.",
  },
  {
    date: "2025-04-07",
    moods: [3, 4],
    activities: ["Yoga", "Gymnastics"],
    weather: "Snowy",
    notes: "Great day of indoor activities on a snowy day.",
  },
  {
    date: "2025-04-06",
    moods: [2, 2],
    activities: ["Running", "Tennis"],
    weather: "Windy",
    notes:
      "Neutral day. The run was challenging due to the wind, but tennis was fun.",
  },
  {
    date: "2025-04-05",
    moods: [0, 1],
    activities: ["Rest"],
    weather: "Rainy",
    notes: "Very difficult day. The rain made it worse.",
  },
  {
    date: "2025-04-04",
    moods: [4, 3],
    activities: ["Cycling", "Handball"],
    weather: "Sunny",
    notes: "Wonderful Sunday with outdoor cycling and handball.",
  },
  {
    date: "2025-04-03",
    moods: [3, 4],
    activities: ["Tennis", "Football"],
    weather: "Cloudy",
    notes: "Great Saturday with outdoor activities and sports.",
  },
  {
    date: "2025-04-02",
    moods: [2, 3],
    activities: ["Swimming", "Cycling"],
    weather: "Windy",
    notes: "Started the day feeling low, but exercise helped improve my mood.",
  },
  {
    date: "2025-04-01",
    moods: [4, 4],
    activities: ["Yoga", "Walking"],
    weather: "Sunny",
    notes: "Perfect day of balance - calming yoga and refreshing walk.",
  },
];
