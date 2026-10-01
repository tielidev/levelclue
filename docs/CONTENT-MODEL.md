# Content model

The example uses one game record and an array of guide records. A real library can split games into separate modules as the corpus grows.

## Game fields

| Field | Meaning |
| --- | --- |
| `name` | Public game name |
| `slug` | Stable lowercase URL segment |
| `description` | Original overview for the game hub |
| `unitLabel` | “Level”, “Chapter”, “Room”, or another in-game unit |
| `image` | Licensed or original representative media |

## Guide fields

| Field | Meaning |
| --- | --- |
| `number` | Structural sequence value |
| `title` | In-game puzzle title or a concise descriptive label |
| `answer` | Direct answer shown before long-form detail |
| `steps` | Ordered, independently useful actions |
| `keywords` | Natural search variants, not a list for keyword stuffing |
| `image` / `imageAlt` | Useful visual evidence and accessible description |
| `updatedAt` | Honest editorial freshness signal |

## Title-led discovery

Players often remember the clue rather than the level number. A query such as “game name black sheep” should still match a guide even if the canonical page is structurally `/level-20/`.

For this reason:

- preserve official puzzle titles when they exist;
- display the title prominently near the level number;
- include it naturally in the document title, H1, description, and JSON-LD;
- add it to the client-side game-hub search index;
- keep level-number URLs stable so renaming a title does not break links.

## Editorial quality

Guide text should be original, tested, and specific. Avoid pages that merely restate a title, embed a video without text, or use fabricated screenshots. Explain gestures, object locations, order dependencies, and failure states when they matter.

