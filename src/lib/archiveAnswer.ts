import { chapters } from "@/data/chapters";
import { letters } from "@/data/letters";
import { places } from "@/data/places";

type Passage = {
  kind: "story" | "letter" | "place";
  source: string;
  sourceOrder: number;
  text: string;
  normalized: string;
  year?: number;
};

type CuratedResponse = {
  patterns: RegExp[];
  answer: string;
};

const STOP_WORDS = new Set([
  "a",
  "about",
  "all",
  "an",
  "and",
  "are",
  "be",
  "did",
  "for",
  "from",
  "happened",
  "how",
  "i",
  "in",
  "is",
  "me",
  "of",
  "on",
  "or",
  "tell",
  "the",
  "their",
  "them",
  "to",
  "was",
  "what",
  "when",
  "where",
  "who",
  "with",
]);

const TERM_EXPANSIONS: Array<{ pattern: RegExp; terms: string[] }> = [
  { pattern: /\bpixie\b|\beleanor workman\b/, terms: ["pixie", "workman", "eleanor"] },
  { pattern: /\balice\b/, terms: ["alice", "gasser", "patrick"] },
  { pattern: /\bpatrick\b/, terms: ["patrick", "gasser", "alice"] },
  { pattern: /\bpenny\b|\bjeanette\b/, terms: ["penny", "adams", "jeanette", "tom"] },
  { pattern: /\btom\b/, terms: ["tom", "adams", "penny"] },
  { pattern: /\binslee\b/, terms: ["inslee", "phd", "chapel", "hill"] },
  { pattern: /\beleanor\b/, terms: ["eleanor", "inslee", "letters"] },
  { pattern: /\bmother'?s day 1973\b|\b1973\b.*\bmother'?s day\b/, terms: ["1973", "mother", "day", "phd", "chapel", "hill"] },
  { pattern: /\b313 jackson avenue\b|\bjackson avenue\b/, terms: ["313", "jackson", "avenue", "lexington", "house"] },
  { pattern: /\bhumanitarian\b|\brefugee\b/, terms: ["humanitarian", "refugee", "ethiopia", "sudan", "rwanda", "thailand"] },
  { pattern: /\bpatrick\b.*\bmeet\b|\bmeet\b.*\bpatrick\b/, terms: ["meet", "patrick", "alice", "africa", "cambodia"] },
];

const CURATED_RESPONSES: CuratedResponse[] = [
  {
    patterns: [/^who is pixie\??$/i, /^who was pixie\??$/i],
    answer:
      "Pixie was Inslee and Eleanor Grainger’s middle daughter. In chapter 1 of the story, she is described as a linguist and mathematician named Eleanor after her mother, who went by Pixie to avoid confusion.\n\nChapter 2 follows her marriage to Jim Workman in 1967 and her move first to Germany and then Newport News, and chapter 5 places her later in Richmond teaching math, working in a needlework shop, and raising Mike and Sarah.",
  },
  {
    patterns: [/alice.*humanitarian/i, /humanitarian.*alice/i, /tell me about alice/i],
    answer:
      "Alice’s humanitarian work becomes one of the major arcs of the later letters. Chapter 6 says she worked first as an OB nurse for the Indian Health Service on the Navajo reservation, then in Ethiopia, Sudan, Thailand, Yugoslavia, and Rwanda.\n\nThe 1985 and 1986 letters place her in Ethiopia and Sudan, and the 1994 letter describes her evacuation from Rwanda with baby Joseph in April 1994 just ahead of the genocide.",
  },
  {
    patterns: [/mother'?s day 1973/i, /what happened on mother'?s day 1973/i],
    answer:
      "Mother’s Day 1973 was the day Inslee Grainger received his PhD from the University of North Carolina. The April 14, 1973 letter is his invitation to relatives to attend commencement in Chapel Hill in his father’s memory and honor.\n\nThe 1973 Christmas letter says the family reunion on Mother’s Day made the occasion \"all that Dr. Grainger deserved.\"",
  },
  {
    patterns: [/how did alice and patrick meet/i, /where did alice and patrick meet/i],
    answer:
      "According to chapter 6 and the 1991 wedding announcement letter, Alice and Patrick met while both were doing refugee work in Africa and Cambodia.\n\nBy April 5, 1991, they were married in Lungern, Switzerland, and the family later held an American celebration at The Homestead in Virginia.",
  },
  {
    patterns: [/313 jackson avenue/i, /jackson avenue/i],
    answer:
      "313 Jackson Avenue was the Graingers’ home in Lexington, Virginia, and one of the central settings of the family story. Chapter 2 describes it as a farmhouse in town that became the setting for renovation projects, student boarders, music, and constant family activity.\n\nThe letters place the family there through much of the 1960s and 1970s, and chapter 8 notes that Alice bought the house in 1993 when Inslee and Eleanor moved to Roanoke.",
  },
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTerms(question: string) {
  const normalizedQuestion = normalize(question);
  const terms = new Set(
    normalizedQuestion
      .split(" ")
      .filter((term) => term.length > 1 && !STOP_WORDS.has(term)),
  );

  for (const expansion of TERM_EXPANSIONS) {
    if (expansion.pattern.test(normalizedQuestion)) {
      for (const term of expansion.terms) {
        terms.add(term);
      }
    }
  }

  return [...terms];
}

function splitIntoParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function summarizePassage(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
  if (sentences.length <= 2) {
    return text.trim();
  }
  return `${sentences[0]} ${sentences[1]}`.trim();
}

const PASSAGES: Passage[] = [
  ...chapters.flatMap((chapter, chapterIndex) =>
    chapter.content.map((paragraph, paragraphIndex) => ({
      kind: "story" as const,
      source: `Chapter ${Number(chapter.number)}: ${chapter.title}`,
      sourceOrder: chapterIndex * 100 + paragraphIndex,
      text: paragraph,
      normalized: normalize(paragraph),
    })),
  ),
  ...letters.flatMap((letter, letterIndex) =>
    splitIntoParagraphs(letter.content).map((paragraph, paragraphIndex) => ({
      kind: "letter" as const,
      source: `${letter.year} letter`,
      sourceOrder: letterIndex * 100 + paragraphIndex,
      text: paragraph,
      normalized: normalize(paragraph),
      year: letter.year,
    })),
  ),
  ...places.map((place, placeIndex) => ({
    kind: "place" as const,
    source: `Place: ${place.name}`,
    sourceOrder: placeIndex,
    text: `${place.name} (${place.period}). ${place.note}`,
    normalized: normalize(`${place.name} ${place.period} ${place.note}`),
  })),
];

function scorePassage(passage: Passage, question: string, terms: string[]) {
  const normalizedQuestion = normalize(question);
  const requestedYears = normalizedQuestion.match(/\b(19|20)\d{2}\b/g) ?? [];
  const isLocationQuestion = /\bwhere\b|\blive\b|\blived\b|\bhome\b|\bbased\b|\blocation\b|\bmap\b/.test(
    normalizedQuestion,
  );
  let score = 0;

  for (const term of terms) {
    if (passage.normalized.includes(term)) {
      score += 3;
    }
    if (normalize(passage.source).includes(term)) {
      score += 2;
    }
  }

  for (const year of requestedYears) {
    if (passage.normalized.includes(year)) {
      score += 4;
    }
  }

  if (requestedYears.length > 0 && !requestedYears.some((year) => passage.normalized.includes(year))) {
    score -= 3;
  }

  if (passage.year && normalizedQuestion.includes(String(passage.year))) {
    score += 4;
  }

  if (isLocationQuestion) {
    score += passage.kind === "place" ? 3 : -1;
  }

  if (normalizedQuestion.includes("mother s day 1973") && passage.source === "1973 letter") {
    score += 6;
  }

  if (normalizedQuestion.includes("313 jackson avenue") && passage.normalized.includes("313 jackson avenue")) {
    score += 6;
  }

  return score;
}

function fallbackAnswer(question: string) {
  const terms = extractTerms(question);
  const ranked = PASSAGES
    .map((passage) => ({
      passage,
      score: scorePassage(passage, question, terms),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.passage.sourceOrder - b.passage.sourceOrder);

  const uniqueSources = new Set<string>();
  const topMatches = ranked.filter((entry) => {
    if (uniqueSources.has(entry.passage.source)) return false;
    uniqueSources.add(entry.passage.source);
    return true;
  }).slice(0, 3);

  if (topMatches.length === 0) {
    return "I couldn’t find a clear answer to that in the letters and story on this site.\n\nTry asking about a person, a place, a year, or an event like Mother’s Day 1973 or 313 Jackson Avenue.";
  }

  const intro =
    topMatches.length === 1
      ? "Here’s the closest reference I found in the archive:"
      : "Here are the strongest references I found in the archive:";

  const body = topMatches
    .map(({ passage }) => `**${passage.source}**\n${summarizePassage(passage.text)}`)
    .join("\n\n");

  return `${intro}\n\n${body}`;
}

export function answerArchiveQuestion(question: string) {
  const trimmed = question.trim();
  if (!trimmed) {
    return "Ask about a family member, a year, a place, or an event from the letters, and I’ll look for it in the archive.";
  }

  for (const response of CURATED_RESPONSES) {
    if (response.patterns.some((pattern) => pattern.test(trimmed))) {
      return response.answer;
    }
  }

  return fallbackAnswer(trimmed);
}
