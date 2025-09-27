import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "indian", name: "Indian", icon: "🍛" },
  { id: "chinese", name: "Chinese", icon: "🥡" },
  { id: "italian", name: "Italian", icon: "🍝" },
  { id: "mexican", name: "Mexican", icon: "🌮" },
  { id: "american", name: "American", icon: "🍔" },
  { id: "thai", name: "Thai", icon: "🍜" },
  { id: "japanese", name: "Japanese", icon: "🍣" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "beverages", name: "Beverages", icon: "🥤" },
  { id: "healthy", name: "Healthy", icon: "🥗" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
];

interface CategoryChipsProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function CategoryChips({ 
  selectedCategory = "all", 
  onCategoryChange 
}: CategoryChipsProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border py-4">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={activeCategory === category.id ? "default" : "secondary"}
                className={`
                  cursor-pointer transition-all duration-200 hover:scale-105 flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap
                  ${activeCategory === category.id 
                    ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border-border'
                  }
                `}
                onClick={() => handleCategoryClick(category.id)}
                data-testid={`chip-category-${category.id}`}
              >
                <span className="text-base">{category.icon}</span>
                <span>{category.name}</span>
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </div>
  );
}