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
  { id: "1", name: "Anupam Yadav", skill: "React Expert", rating: 4.9, price: 40, avatar: "https://anupamyadavanurag.github.io/images/about-me.png"},
  { id: "2", name: "Ayushi", skill: "English", rating: 4.8, price: 55, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan", tagline: "From your first chord to your first song." },
  { id: "3", name: "Gargi Soni", skill: "Public Speaking", rating: 5.0, price: 70, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", tagline: "Confidence on stage, in 4 sessions." },
  { id: "4", name: "Prakhar Agrawal", skill: "Photography", rating: 4.7, price: 35, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tomas", tagline: "Compose, light, edit. The full loop." },
  { id: "5", name: "Prabhansh Tiwari", skill: "Data Science", rating: 4.9, price: 50, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiko", tagline: "JLPT-ready in months, not years." },
  { id: "6", name: "Satyam Gupta", skill: "UI Design", rating: 4.8, price: 60, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam", tagline: "Real product critiques, real growth." },
  { id: "7", name: "Anuj Yadav", skill: "Java", rating: 4.6, price: 30, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lina", tagline: "Parisian accent, friendly pace." },
  { id: "8", name: "Rohan Mehta", skill: "Coding", rating: 4.9, price: 65, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan", tagline: "From zero to shipping side projects." },];

export const SKILLS = ["All", ...Array.from(new Set(TEACHERS.map((t) => t.skill)))];
