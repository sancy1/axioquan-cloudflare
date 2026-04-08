// SearchFilters type definition for course filtering
export interface SearchFilters {
  searchQuery: string;
  category_slug: string;
  difficulty: string;
  content_type: string;
  price_range: string;
  min_rating: number;
  language: string;
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  sort_by: string;
  instructor: string;
}
