import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "maize-grits",
    name: "Maize Grits",
    description:
      "Maize Grits provide energy-rich carbohydrates and can be enjoyed with milk, groundnuts, honey, or fresh fruits for added nutrition and taste.",
    images: [
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80",
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
      "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80",
    ],
    usageGuide: [
      {
        step: 1,
        title: "Practice Good Hygiene",
        description:
          "Wash hands thoroughly and ensure all utensils and cooking pots are clean before preparation.",
      },
      {
        step: 2,
        title: "Wash the Grits",
        description: "Rinse maize grits with clean water and drain completely.",
      },
      {
        step: 3,
        title: "Boil Water",
        description:
          "Bring 3 cups of potable water to a rolling boil (approximately 100°C).",
      },
      {
        step: 4,
        title: "Add Maize Grits",
        description:
          "Gradually pour the maize grits into the boiling water while stirring continuously to prevent lumps.",
      },
      {
        step: 5,
        title: "Cook Thoroughly",
        description:
          "Reduce heat and simmer for 15–20 minutes, stirring occasionally. Add remaining water gradually to achieve your preferred consistency. Cook until soft, smooth, and free from any raw taste.",
      },
      {
        step: 6,
        title: "Serve Hot",
        description:
          "Serve hot at a minimum temperature of 65°C. Enjoy with milk, sugar, honey, butter, peanut paste, or fresh fruits.",
      },
    ],
    category: "Grains & Tubers",
    sections: [
      {
        title: "Food Safety & Handling",
        type: "list",
        items: [
          "Use only clean, safe potable water.",
          "Wash hands before and after food preparation.",
          "Avoid contamination from raw foods and foreign materials.",
          "Product is made from 100% maize.",
          "Naturally gluten-free.",
        ],
      },
      {
        title: "Storage Instructions",
        type: "table",
        rows: [
          { label: "Uncooked Product", value: "Store in a cool, dry place away from direct sunlight. Keep sealed after opening." },
          { label: "Cooked Porridge", value: "Refrigerate at ≤4°C and consume within 24 hours. Reheat thoroughly before serving. Do not reheat more than once." },
        ],
      },
      {
        title: "Nutritional Benefits",
        type: "paragraph",
        body: "Maize grits provide energy-rich carbohydrates and can be enjoyed with milk, groundnuts, honey, or fresh fruits for added nutrition and taste.",
      },
      {
        title: "Serving Suggestion",
        type: "paragraph",
        body: "Enjoy your delicious maize grits porridge with dried fruits for an enhanced breakfast experience.",
      },
    ],
  },
  {
    id: "2",
    slug: "whole-grain-corn-flour",
    name: "Whole Grain Corn Flour",
    description:
      "Whole Grain Corn Flour is produced from carefully selected whole maize grains and contains the bran, germ, and endosperm, providing natural fiber, vitamins, and minerals for healthy nutrition.",
    images: [
      "https://images.unsplash.com/photo-1558968363-005b66c7b0c8?w=800&q=80",
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
      "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80",
    ],
    usageGuide: [
      {
        step: 1,
        title: "Mix the Flour",
        description:
          "Mix the whole grain maize flour with cool water in a clean bowl to form a smooth slurry without lumps.",
      },
      {
        step: 2,
        title: "Cook on Medium Heat",
        description:
          "Pour the mixture into a cooking pot and place on medium heat. Stir continuously with a wooden spatula or banku stick to prevent lumps.",
      },
      {
        step: 3,
        title: "Add Cassava Dough (Optional)",
        description:
          "If using cassava dough, add it gradually while stirring continuously until evenly mixed.",
      },
      {
        step: 4,
        title: "Cook Until Firm",
        description:
          "Continue cooking and turning the mixture for 15–25 minutes until it becomes firm, smooth, and elastic.",
      },
      {
        step: 5,
        title: "Sprinkle Water if Needed",
        description:
          "Sprinkle small amounts of water around the edges if the banku becomes too thick during cooking.",
      },
      {
        step: 6,
        title: "Mold and Serve",
        description:
          "Mold into round portions using a bowl or calabash. Serve hot with soup, stew, okro, pepper sauce, fish, or meat.",
      },
    ],
    category: "Flours & Meals",
    sections: [
      {
        title: "Preparation for Porridge",
        type: "steps",
        steps: [
          {
            title: "Mix Paste",
            description:
              "Mix 1 cup of whole grain maize flour with 1 cup of cool water to form a smooth paste. Stir well to avoid lumps.",
          },
          {
            title: "Boil Water",
            description: "Boil the remaining water in a clean cooking pot.",
          },
          {
            title: "Combine and Cook",
            description:
              "Gradually pour the maize flour mixture into the boiling water while stirring continuously. Reduce heat and cook for 10–15 minutes, stirring regularly until smooth and thick.",
          },
          {
            title: "Add Optional Ingredients",
            description:
              "Add sugar, milk, butter, peanut paste, honey, or salt according to taste.",
          },
          {
            title: "Serve Hot",
            description: "Serve hot as a nutritious breakfast or light meal.",
          },
        ],
      },
      {
        title: "Consumer Tips",
        type: "list",
        items: [
          "Continuous stirring ensures smooth texture and even cooking.",
          "Adjust water quantity depending on the desired softness.",
          "Best served fresh and hot.",
          "Store flour in a cool, dry place away from moisture.",
          "Add more water for a lighter porridge consistency.",
        ],
      },
      {
        title: "Food Safety & Handling",
        type: "list",
        items: [
          "Use only clean, safe potable water.",
          "Wash hands before and after food preparation.",
          "Avoid contamination from raw foods and foreign materials.",
          "Product is made from 100% maize.",
          "Naturally gluten-free.",
        ],
      },
      {
        title: "Storage Instructions",
        type: "table",
        rows: [
          { label: "Uncooked Product", value: "Store in a cool, dry place away from direct sunlight. Keep sealed after opening." },
          { label: "Cooked Porridge", value: "Refrigerate at ≤4°C and consume within 24 hours. Reheat thoroughly before serving. Do not reheat more than once." },
        ],
      },
      {
        title: "Other Common Uses",
        type: "columns",
        columns: [
          {
            heading: "Porridge and Breakfast Meals",
            items: ["Kenkey", "Tuo Zaafi", "Koko"],
          },
          {
            heading: "Baking",
            items: ["Bread", "Muffins", "Pancakes", "Biscuits", "Cookies"],
            note: "Often mixed with wheat flour to improve nutrition and texture.",
          },
          {
            heading: "Thickening Agent",
            items: ["Soups", "Stews", "Sauces", "Gravies"],
          },
          {
            heading: "Traditional Foods",
            items: ["Tortillas", "Dumplings", "Corn cakes", "Fufu blends"],
          },
          {
            heading: "Snack Production",
            items: ["Chips", "Crackers", "Extruded snacks", "Breakfast cereals"],
          },
          {
            heading: "Animal Feed Ingredient",
            items: ["Poultry feed", "Pig feed", "Fish feed"],
          },
          {
            heading: "Health and Nutrition Products",
            items: [
              "High fiber content",
              "Better digestion",
              "Longer feeling of fullness",
              "Natural vitamins and antioxidants",
              "Healthy meal plans",
              "Diabetic-friendly diets (in moderation)",
              "High-energy foods",
            ],
          },
          {
            heading: "Baby and Elderly Foods",
            items: ["Weaning foods", "Soft diets for elderly people"],
          },
          {
            heading: "Industrial Food Processing",
            items: ["Composite flour production", "Instant meal products", "Fortified flour blends"],
          },
        ],
      },
      {
        title: "Nutritional Benefits",
        type: "list",
        items: [
          "Dietary fiber",
          "Vitamin B complex",
          "Iron",
          "Magnesium",
          "Healthy fats from the germ",
        ],
      },
      {
        title: "Storage Advice",
        type: "list",
        items: [
          "Store in airtight containers",
          "Keep in a cool, dry place",
          "Protect from moisture and insects",
        ],
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}
