from typing import List, Dict

def merge_subwords(predictions: List[Dict], text: str) -> List[Dict]:
    """Merge subword tokens into complete words."""
    merged_entities = []
    current_entity = None

    for pred in predictions:
        word = pred['word']
        if word.startswith("##"):  # Subword token
            if current_entity:
                current_entity['word'] += word[2:]  # Append subword
                current_entity['end'] = pred['end']  # Update the end position
                current_entity['score'] = max(current_entity['score'], pred['score'])  # Max confidence
        else:  # New word starts
            if current_entity:
                merged_entities.append(current_entity)
            current_entity = {
                'entity_group': pred['entity_group'],
                'word': word,
                'start': pred['start'],
                'end': pred['end'],
                'score': pred['score']
            }

    if current_entity:
        merged_entities.append(current_entity)

    return merged_entities