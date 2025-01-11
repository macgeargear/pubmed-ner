"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import HighlightedText, { Entity } from "@/components/highlighted-text";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Home = () => {
  const [text, setText] = useState<string>("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<string>("d4data/biomedical-ner-all");

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/ner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch NER results");
      }

      const data = await response.json();
      setEntities(data.entities);
    } catch (error) {
      console.error("Error fetching NER results:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("entities", entities);

  return (
    <div className="container mt-40 mx-auto p-4">
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl my-4 font-bold text-center">
          PubMed Abstract NER
        </h1>
        <Textarea
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="mb-4"
        />
        <div className="flex mx-auto justify-center items-center w-fit gap-4">
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-fit mx-auto"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
          <Select onValueChange={(value) => setModel(value)} value={model}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Model</SelectLabel>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="gpt-3.5-turbo">Gpt 3.5 Turbo</SelectItem>
                <SelectItem value="d4data/biomedical-ner-all">
                  d4data/biomedical-ner-all
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">NER Results:</h2>
        <div className="p-4 border border-gray-300 rounded bg-gray-50 text-lg leading-relaxed">
          <HighlightedText text={text} entities={entities} />
        </div>
      </div>
    </div>
  );
};

export default Home;
