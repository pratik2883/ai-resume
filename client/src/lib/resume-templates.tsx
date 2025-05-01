export interface TemplateInfo {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
}

export const templates: TemplateInfo[] = [
  {
    id: 1,
    name: "Modern",
    description: "Clean and professional design",
    thumbnail: "https://images.unsplash.com/photo-1586282023338-52aa50afb12c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Professional",
    description: "Perfect for senior positions",
    thumbnail: "https://images.unsplash.com/photo-1542744094-24638eff58bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Creative",
    description: "Stand out with style",
    thumbnail: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

export default templates;
