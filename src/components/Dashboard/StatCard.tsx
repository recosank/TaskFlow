import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import AnimatedNumber from "./AnimatedNumber";

export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card className="py-4 shadow-sm border">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm text-gray-500">{label}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-semibold">
          <AnimatedNumber value={value} />
        </div>
      </CardContent>
    </Card>
  );
}
