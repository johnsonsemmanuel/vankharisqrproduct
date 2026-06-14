"use client";

import { useState } from "react";
import { Recipe } from "@/types";
import { ChefHat, Clock, Users, Plus, Minus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RecipeViewerProps {
  recipes: Recipe[];
}

export default function RecipeViewer({ recipes }: RecipeViewerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const recipe = recipes[selectedIdx];

  const [servings, setServings] = useState(recipe?.servings ?? 2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!recipe) return null;

  const handleSelectRecipe = (idx: number) => {
    setSelectedIdx(idx);
    setServings(recipes[idx].servings);
    setCompletedSteps([]);
  };

  const scaleFactor = servings / recipe.servings;

  const toggleStep = (stepIdx: number) => {
    if (completedSteps.includes(stepIdx)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepIdx));
    } else {
      setCompletedSteps([...completedSteps, stepIdx]);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-kharis-green-100 dark:border-neutral-800 overflow-hidden">
      {/* Recipe Tabs */}
      {recipes.length > 1 && (
        <div className="flex border-b border-kharis-green-100 dark:border-neutral-800 bg-kharis-green-50/20 dark:bg-neutral-950/20 p-1 gap-1">
          {recipes.map((r, idx) => (
            <button
              key={r.name}
              onClick={() => handleSelectRecipe(idx)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedIdx === idx
                  ? "bg-white dark:bg-neutral-800 text-kharis-green-800 dark:text-kharis-gold-400 shadow-sm"
                  : "text-kharis-green-600 dark:text-neutral-400 hover:text-kharis-green-800 dark:hover:text-neutral-200"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <ChefHat className="w-5 h-5 text-kharis-gold-500" />
          <h3 className="text-lg font-bold text-kharis-green-800 dark:text-neutral-100">
            {recipe.name}
          </h3>
        </div>

        {/* Recipe Meta */}
        <div className="flex gap-4 mb-5 text-xs text-neutral-600 dark:text-neutral-400">
          {recipe.prepTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-kharis-green-500" />
              <span>Prep: {recipe.prepTime}</span>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-kharis-green-500" />
              <span>Cook: {recipe.cookTime}</span>
            </div>
          )}
        </div>

        {/* Portion Scaler */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-kharis-green-50/30 dark:bg-neutral-950/30 border border-kharis-green-100/50 dark:border-neutral-800/50 mb-5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-kharis-green-600 dark:text-kharis-gold-500" />
            <span className="text-xs font-bold text-kharis-green-800 dark:text-neutral-200">
              Portion Calculator
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-kharis-green-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-kharis-green-700 dark:text-neutral-300 hover:bg-kharis-green-50 dark:hover:bg-neutral-700/50 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-black text-kharis-green-800 dark:text-neutral-100 w-6 text-center">
              {servings}
            </span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-kharis-green-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-kharis-green-700 dark:text-neutral-300 hover:bg-kharis-green-50 dark:hover:bg-neutral-700/50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-kharis-green-800 dark:text-neutral-300 uppercase tracking-wider mb-2.5">
            Scaled Ingredients
          </h4>
          <ul className="divide-y divide-kharis-green-50/50 dark:divide-neutral-800/50 border border-kharis-green-50/50 dark:border-neutral-800/50 rounded-lg overflow-hidden">
            {recipe.ingredients.map((ing) => {
              const scaledAmount = Number((ing.amount * scaleFactor).toFixed(1));
              return (
                <li
                  key={ing.name}
                  className="flex justify-between items-center px-3 py-2 text-xs text-neutral-700 dark:text-neutral-200"
                >
                  <span className="font-medium">{ing.name}</span>
                  <span className="font-bold text-kharis-green-700 dark:text-kharis-gold-400">
                    {scaledAmount} {ing.unit}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h4 className="text-xs font-bold text-kharis-green-800 dark:text-neutral-300 uppercase tracking-wider mb-2.5">
            Directions
          </h4>
          <div className="space-y-2.5">
            {recipe.steps.map((step, idx) => {
              const isDone = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex gap-3 p-3 rounded-lg border text-xs leading-relaxed transition-all cursor-pointer ${
                    isDone
                      ? "bg-neutral-50 dark:bg-neutral-950 border-neutral-100 dark:border-neutral-900 opacity-60 line-through"
                      : "bg-white dark:bg-neutral-900 border-kharis-green-50/50 dark:border-neutral-800 hover:border-kharis-green-200 dark:hover:border-neutral-750"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone
                        ? "bg-kharis-green-600 border-kharis-green-600 text-white"
                        : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3" />}
                  </div>
                  <span className={isDone ? "text-neutral-400" : "text-neutral-700 dark:text-neutral-200"}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
