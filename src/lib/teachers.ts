export type Teacher = {
  id: string;
  name: string;
  skill: string;
  rating: number;
  price: number;
  avatar: string;
  tagline: string;
};

export const TEACHERS: Teacher[] = [
  { id: "1", name: "Maya Chen", skill: "Spanish", rating: 4.9, price: 40, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya", tagline: "Conversational Spanish, no boring drills." },
  { id: "2", name: "Jordan Park", skill: "Guitar", rating: 4.8, price: 55, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan", tagline: "From your first chord to your first song." },
  { id: "3", name: "Priya Nair", skill: "Public Speaking", rating: 5.0, price: 70, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", tagline: "Confidence on stage, in 4 sessions." },
  { id: "4", name: "Tomás Silva", skill: "Photography", rating: 4.7, price: 35, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tomas", tagline: "Compose, light, edit. The full loop." },
  { id: "5", name: "Aiko Tanaka", skill: "Japanese", rating: 4.9, price: 50, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiko", tagline: "JLPT-ready in months, not years." },
  { id: "6", name: "Sam Okafor", skill: "UI Design", rating: 4.8, price: 60, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam", tagline: "Real product critiques, real growth." },
  { id: "7", name: "Lina Roth", skill: "French", rating: 4.6, price: 30, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lina", tagline: "Parisian accent, friendly pace." },
  { id: "8", name: "Rohan Mehta", skill: "Coding", rating: 4.9, price: 65, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan", tagline: "From zero to shipping side projects." },
];

export const SKILLS = ["All", ...Array.from(new Set(TEACHERS.map((t) => t.skill)))];
