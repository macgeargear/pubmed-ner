import React, { JSX } from "react";

interface Entity {
  text: string;
  label: string;
  start: number;
  end: number;
}

interface EntityHighlightProps {
  text: string;
  entities: Entity[];
}

const EntityHighlight: React.FC<EntityHighlightProps> = ({
  text,
  entities,
}) => {
  const sortedEntities = [...entities].sort((a, b) => a.start - b.start);

  const highlightedText: JSX.Element[] = [];
  let curIdx = 0;

  sortedEntities.forEach((entity, index) => {
    const { start, end, label, text: entityText } = entity;

    if (start > curIdx) {
      highlightedText.push(
        <span key={`text-${index}-${curIdx}`}>{text.slice(curIdx, start)}</span>
      );
    }

    highlightedText.push(
      <span
        key={`entity-${index}`}
        className="inline-block px-2 py-1 mx-1 rounded bg-blue-200 text-blue-800"
        title={label}
      >
        [{entityText}][{label}]
      </span>
    );

    curIdx = end;
  });

  if (curIdx < text.length) {
    highlightedText.push(<span key={`text-end`}>{text.slice(curIdx)}</span>);
  }

  return <div className="text-lg leading-relaxed">{highlightedText}</div>;
};

export default EntityHighlight;
