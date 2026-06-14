import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "maize-grits",
    name: "Maize Grits",
    description:
      "Maize Grits provide energy-rich carbohydrates and can be enjoyed with milk, groundnuts, honey, or fresh fruits for added nutrition and taste.",
    images: ["/images/maize-grits.jpg"],
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
    recipes: [
      {
        name: "Classic Creamy Porridge",
        prepTime: "5 mins",
        cookTime: "20 mins",
        servings: 2,
        ingredients: [
          { name: "Maize Grits", amount: 100, unit: "g" },
          { name: "Water", amount: 600, unit: "ml" },
          { name: "Milk", amount: 100, unit: "ml" },
          { name: "Sugar or Honey", amount: 2, unit: "tbsp" }
        ],
        steps: [
          "Bring water to a boil in a medium pot.",
          "Gradually stir in the maize grits, reducing heat to low.",
          "Cover and simmer for 15-20 minutes, stirring occasionally to prevent sticking.",
          "Stir in the milk and sweetener, cook for another 2 minutes, then serve hot."
        ]
      },
      {
        name: "Savory Grits with Fried Egg",
        prepTime: "5 mins",
        cookTime: "15 mins",
        servings: 1,
        ingredients: [
          { name: "Maize Grits", amount: 80, unit: "g" },
          { name: "Vegetable Broth", amount: 400, unit: "ml" },
          { name: "Butter", amount: 1, unit: "tbsp" },
          { name: "Egg", amount: 1, unit: "pc" },
          { name: "Salt and Pepper", amount: 1, unit: "pinch" }
        ],
        steps: [
          "Cook the grits in boiling vegetable broth according to basic instructions.",
          "Once thick and cooked, stir in the butter, salt, and pepper.",
          "Fry an egg in a separate pan to your liking.",
          "Top the warm grits with the fried egg and serve immediately."
        ]
      }
    ],
    translations: {
      fr: {
        name: "Gruau de Maïs (Grits)",
        tagline: "Énergisant et nutritif",
        description: "Le gruau de maïs fournit des glucides riches en énergie et peut être dégusté avec du lait, des arachides, du miel ou des fruits frais.",
        usageGuide: [
          { step: 1, title: "Hygiène", description: "Lavez-vous soigneusement les mains et assurez-vous que les ustensiles sont propres." },
          { step: 2, title: "Laver le Maïs", description: "Rincez le gruau de maïs à l'eau claire et égouttez complètement." },
          { step: 3, title: "Faire bouillir l'eau", description: "Portez 3 tasses d'eau potable à ébullition (environ 100°C)." },
          { step: 4, title: "Ajouter le gruau", description: "Versez le gruau de maïs dans l'eau bouillante en remuant continuellement pour éviter les grumeaux." },
          { step: 5, title: "Cuire", description: "Réduire le feu et mijoter pendant 15 à 20 minutes en remuant de temps en temps." },
          { step: 6, title: "Servir Chaud", description: "Servir chaud. Dégustez avec du lait, du sucre, du miel, ou des fruits." }
        ]
      }
    }
  },
  {
    id: "2",
    slug: "whole-grain-corn-flour",
    name: "Whole Grain Corn Flour",
    description:
      "Whole Grain Corn Flour is produced from carefully selected whole maize grains and contains the bran, germ, and endosperm, providing natural fiber, vitamins, and minerals for healthy nutrition.",
    images: ["/images/maize-flour.jpeg"],
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
    recipes: [
      {
        name: "Traditional Ghanaian Banku",
        prepTime: "10 mins",
        cookTime: "25 mins",
        servings: 4,
        ingredients: [
          { name: "Whole Grain Corn Flour", amount: 300, unit: "g" },
          { name: "Water", amount: 500, unit: "ml" },
          { name: "Salt", amount: 1, unit: "tsp" }
        ],
        steps: [
          "Mix the corn flour and water together in a pot until a smooth slurry is formed.",
          "Place the pot on medium heat and stir constantly with a wooden spoon or banku stick.",
          "As it thickens, use force to knead and turn the dough against the sides of the pot to prevent lumps.",
          "Cook for 20-25 minutes, then shape into balls and serve hot with soup or stew."
        ]
      },
      {
        name: "Golden Corn Muffins",
        prepTime: "10 mins",
        cookTime: "15 mins",
        servings: 6,
        ingredients: [
          { name: "Whole Grain Corn Flour", amount: 150, unit: "g" },
          { name: "Wheat Flour", amount: 100, unit: "g" },
          { name: "Baking Powder", amount: 1, unit: "tbsp" },
          { name: "Milk", amount: 200, unit: "ml" },
          { name: "Egg", amount: 1, unit: "pc" },
          { name: "Melted Butter", amount: 50, unit: "g" }
        ],
        steps: [
          "Preheat your oven to 200°C and grease a muffin tray.",
          "Whisk the dry ingredients (corn flour, wheat flour, baking powder) in a bowl.",
          "Mix the wet ingredients (milk, egg, butter) and fold them into the dry ingredients.",
          "Bake for 15 minutes or until golden brown."
        ]
      }
    ],
    translations: {
      fr: {
        name: "Farine de Maïs Complète",
        tagline: "Farine de grains entiers de qualité supérieure",
        description: "La farine de maïs complète est produite à partir de grains de maïs entiers soigneusement sélectionnés et contient le son, le germe et l'endosperme.",
        usageGuide: [
          { step: 1, title: "Mélanger la farine", description: "Mélanger la farine de maïs avec de l'eau froide dans un bol propre pour former une pâte lisse." },
          { step: 2, title: "Cuire à feu moyen", description: "Verser le mélange dans une casserole sur feu moyen. Remuer continuellement." },
          { step: 3, title: "Ajouter la pâte de manioc", description: "Si vous utilisez de la pâte de manioc, ajoutez-la progressivement en remuant." },
          { step: 4, title: "Cuire jusqu'à fermeté", description: "Continuer à cuire pendant 15-25 minutes jusqu'à ce que la texture soit ferme et lisse." },
          { step: 5, title: "Saupoudrer d'eau", description: "Saupoudrer de petites quantités d'eau si le mélange devient trop épais." },
          { step: 6, title: "Mouler et servir", description: "Mouler en portions rondes. Servir chaud avec de la soupe ou du ragoût." }
        ]
      }
    }
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}
