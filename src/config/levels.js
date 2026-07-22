export const LEVELS = [
  { id: "easy", name: "Dễ", description: "Những lá cờ quen thuộc", color: "#35D0BA", icon: "🌱" },
  { id: "normal", name: "Vừa", description: "Thử thách kiến thức của bạn", color: "#FFCA62", icon: "⚡" },
  { id: "hard", name: "Khó", description: "Dành cho chuyên gia địa lý", color: "#FF6B7A", icon: "🔥" },
];

export const getLevel = (id) => LEVELS.find((level) => level.id === id) || LEVELS[0];
