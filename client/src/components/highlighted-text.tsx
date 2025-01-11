import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export interface Entity {
  text: string;
  label: string;
  start: number;
  end: number;
  score: number;
}

const HighlightedText = ({
  text,
  entities,
}: {
  text: string;
  entities: Entity[];
}) => {
  if (!entities.length) return <>{text}</>;

  const sortedEntities = [...entities].sort((a, b) => a.start - b.start);
  const highlightedText = [];
  let currentIndex = 0;

  sortedEntities.forEach((entity, index) => {
    const { start, end, label, text: entityText, score } = entity;

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
            className={cn(
              "px-2 mx-1 rounded cursor-pointer text-blue-800 bg-blue-300 font-semibold hover:bg-blue-400"
            )}
          >
            {text.slice(start, end)}
          </span>
        </PopoverTrigger>
        <PopoverContent className="p-4 max-w-sm border-gray-300 shadow-md rounded-md bg-white">
          <div>
            <h4 className="text-lg font-semibold text-blue-800 mb-2">
              Entity Information
            </h4>
            <p>
              <strong>Text:</strong> {entityText || text.slice(start, end)}
            </p>
            <p>
              <strong>Label:</strong> {label}
            </p>
            <p>
              <strong>Position:</strong> {start} - {end}
            </p>
            <p>
              <strong>Score:</strong> {score.toFixed(4)}
            </p>
          </div>
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

  return <>{highlightedText}</>;
};

export default HighlightedText;
