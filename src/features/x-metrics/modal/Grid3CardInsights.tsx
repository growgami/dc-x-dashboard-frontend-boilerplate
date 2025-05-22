/**
 * Grid3CardInsights
 * -----------------------------------------------------------------------------
 * EXAMPLE INSIGHT CHILD COMPONENT
 *
 * This component demonstrates the pattern for an "insight" card to be rendered
 * inside InsightsModal. To create a new insight card:
 *
 * 1. Create a new file (e.g., GridXCardInsights.tsx) in this directory.
 * 2. Export a React component that receives any required props (optionally typed).
 * 3. Implement your insight UI using Card/CardContent or your preferred layout.
 * 4. (Optional) Accept props from InsightsModal via the `data` prop.
 * 5. Register your new component in InsightsModal's cardComponentMap and import it.
 *
 * Best Practices:
 * - Use clear prop types for any data your insight needs.
 * - Keep the component focused on a single insight or metric group.
 * - Add inline comments to clarify logic or data mapping.
 *
 * See: src/components/modals/InsightsModal.tsx for integration steps.
 */

"use client"

import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/cards/Card";

// Example static data for demonstration.
// In a real insight card, you may receive this via props from InsightsModal.
const exampleInsights = [
  {
    label: "Followers",
    value: 12450,
    change: "+3.2%",
    description: "Growth in the last 30 days",
    color: "var(--chart-1)",
  },
  {
    label: "Impressions",
    value: 98200,
    change: "+1.8%",
    description: "Total impressions this month",
    color: "var(--chart-2)",
  },
  {
    label: "Engagements",
    value: 4300,
    change: "-0.5%",
    description: "Engagements compared to last month",
    color: "var(--chart-3)",
  },
];

// This component could accept props for dynamic data, e.g.:
// interface Grid3CardInsightsProps { insights: Array<...>; }
// const Grid3CardInsights: React.FC<Grid3CardInsightsProps> = ({ insights }) => { ... }
const Grid3CardInsights: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <CardContent>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          X Metrics Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Render each insight as a card section */}
          {exampleInsights.map((insight) => (
            <div
              key={insight.label}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              {/* Label */}
              <span
                className="text-lg font-semibold"
                style={{ color: `hsl(${insight.color})` }}
              >
                {insight.label}
              </span>
              {/* Value */}
              <span className="text-3xl font-bold text-gray-900 mt-2">
                {insight.value.toLocaleString()}
              </span>
              {/* Change indicator */}
              <span
                className={`mt-1 text-sm font-medium ${
                  insight.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {insight.change}
              </span>
              {/* Description */}
              <span className="mt-1 text-xs text-gray-500 text-center">
                {insight.description}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Grid3CardInsights;