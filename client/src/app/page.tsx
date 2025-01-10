"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Entity {
  text: string;
  label: string;
  start: number;
  end: number;
}

const Home = () => {
  const [text, setText] = useState<string>("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch NER results");
      }

      const data = await response.json();
      setEntities(data.entities);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderHighlightedText = () => {
    if (!entities.length) return text;

    const sortedEntities = [...entities].sort((a, b) => a.start - b.start);
    const highlightedText = [];
    let currentIndex = 0;

    sortedEntities.forEach((entity, index) => {
      const { start, end, label } = entity;

      if (start > currentIndex) {
        highlightedText.push(
          <span key={`text-${index}-${currentIndex}`}>
            {text.slice(currentIndex, start)}
          </span>
        );
      }

      highlightedText.push(
        <Popover key={`popover-${index}`}>
          <PopoverTrigger asChild>
            <span
              key={`entity-${index}`}
              className={cn("rounded text-blue-800 font-semibold", {
                "bg-blue-300": label[0] == "B",
                "bg-rose-300": label[0] == "I",
              })}
              title={label}
            >
              {text.slice(start, end)}
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <span className="text-zinc-700">({label})</span>
          </PopoverContent>
        </Popover>
      );

      currentIndex = end;
    });

    if (currentIndex < text.length) {
      highlightedText.push(
        <span key={`text-end`}>{text.slice(currentIndex)}</span>
      );
    }

    return highlightedText;
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            PubMed NER Highlighter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="mb-4"
          />
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </CardContent>
      </Card>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">NER Results:</h2>
        <div className="p-4 border border-gray-300 rounded bg-gray-50 text-lg leading-relaxed">
          {renderHighlightedText()}
        </div>
      </div>
    </div>
  );
};

export default Home;
