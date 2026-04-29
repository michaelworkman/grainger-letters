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

type QuestionProfile = {
  normalizedQuestion: string;
  requestedYears: string[];
  asksWhen: boolean;
  asksWhere: boolean;
  asksWho: boolean;
  asksWhy: boolean;
  asksHow: boolean;
  mentionsMarriage: boolean;
  mentionsBirth: boolean;
  mentionsDeath: boolean;
  mentionsEducation: boolean;
  activeEntityAliases: string[];
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
  "do",
  "does",
  "for",
  "from",
  "get",
  "got",
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

const ENTITY_GROUPS: Array<{ pattern: RegExp; aliases: string[] }> = [
  {
    pattern: /\bmike workman\b|\bmichael workman\b/,
    aliases: ["workman", "pixie", "jim", "sarah", "richmond", "chapel", "hill", "unc", "journalism", "norfolk"],
  },
  {
    pattern: /\bmike adams\b|\bmichael dollison\b/,
    aliases: ["adams", "penny", "tom", "mimi", "fort", "dix", "brussels", "belgium", "roanoke", "washington", "lee", "computer", "electronics"],
  },
  { pattern: /\bpix(?:ie)?\b|\beleanor workman\b|\bjim workman\b/, aliases: ["pixie", "pix", "jim", "workman"] },
  { pattern: /\balice\b|\bgasser\b|\bpatrick\b/, aliases: ["alice", "patrick", "gasser", "joseph", "elena"] },
  { pattern: /\bpenny\b|\bjeanette\b|\badams\b/, aliases: ["penny", "jeanette", "tom", "adams"] },
  { pattern: /\binslee\b/, aliases: ["inslee", "grainger", "doctorate", "phd"] },
  { pattern: /\beleanor\b/, aliases: ["eleanor", "grainger", "letters"] },
];

const TERM_EXPANSIONS: Array<{ pattern: RegExp; terms: string[] }> = [
  {
    pattern: /\bmike workman\b|\bmichael workman\b/,
    terms: ["workman", "pixie", "jim", "sarah", "richmond", "chapel", "hill", "unc", "journalism", "norfolk"],
  },
  {
    pattern: /\bmike adams\b|\bmichael dollison\b/,
    terms: ["adams", "penny", "tom", "mimi", "fort", "dix", "brussels", "belgium", "roanoke", "washington", "lee", "computer", "electronics"],
  },
  { pattern: /\bpix(?:ie)?\b|\beleanor workman\b|\bjim workman\b/, terms: ["pixie", "pix", "jim", "workman", "eleanor"] },
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
    patterns: [/^who is mike workman\??$/i, /^who was mike workman\??$/i, /tell me about mike workman/i],
    answer:
      "Mike Workman was Pixie and Jim Workman’s son, the second of the two cousins named Mike. Chapter 4 says he was born in Richmond in 1972, and chapter 5 follows him growing up in Richmond with his sister Sarah.\n\nThe later letters place him at UNC Chapel Hill beginning in 1990. The 1994 letter says he graduated there in Journalism and went on to work at a newspaper in Norfolk.",
  },
  {
    patterns: [/^who is mike adams\??$/i, /^who was mike adams\??$/i, /tell me about mike adams/i],
    answer:
      "Mike Adams was Penny and Tom Adams’s son, and the first of the two cousins named Mike. Chapter 4 says he was born on September 23, 1970, at Fort Dix, New Jersey, and became the family’s first grandchild.\n\nThe story and later letters say he grew up in an Army family, studied languages and computer science, attended Washington and Lee, and later consulted in computers and electronics.",
  },
  {
    patterns: [/which mike went to unc/i, /which mike went to chapel hill/i, /who went to unc.*mike/i],
    answer:
      "Mike Workman was the Mike who went to UNC Chapel Hill. Chapter 5 places him there beginning in 1990, and the 1994 letter says he graduated from Chapel Hill in Journalism before going to work at a Norfolk newspaper.\n\nMike Adams was the cousin who attended Washington and Lee instead.",
  },
  {
    patterns: [/which mike went to washington and lee/i, /which mike went to w and l/i, /which mike went to w&l/i],
    answer:
      "Mike Adams was the Mike who attended Washington and Lee. Chapter 4 identifies him as Penny and Tom Adams’s son, and the later letters describe him studying languages and computer science there.\n\nMike Workman was the cousin who went to UNC Chapel Hill instead.",
  },
  {
    patterns: [/difference between mike workman and mike adams/i, /who is which mike/i, /two cousins named mike/i],
    answer:
      "The letters distinguish between two cousins named Mike. Mike Adams was Penny and Tom Adams’s son, born at Fort Dix in 1970; he later attended Washington and Lee and worked in computers and electronics.\n\nMike Workman was Pixie and Jim Workman’s son, born in Richmond in 1972; he later attended UNC Chapel Hill, graduated in Journalism, and worked at a Norfolk newspaper.",
  },
  {
    patterns: [
      /when did pix(?:ie)? get married/i,
      /when did pix(?:ie)? marry/i,
      /when was pix(?:ie)? married/i,
      /when did eleanor workman get married/i,
    ],
    answer:
      "Pixie married Jim Workman on April 8, 1967, in Lexington. The December 8, 1966 letter says the wedding was scheduled for April 8, and the December 6, 1967 letter says that plan had become a reality by April eighth.",
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

function splitIntoSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"“])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function detectQuestionProfile(question: string): QuestionProfile {
  const normalizedQuestion = normalize(question);
  const activeEntityAliases = new Set<string>();

  for (const group of ENTITY_GROUPS) {
    if (group.pattern.test(normalizedQuestion)) {
      for (const alias of group.aliases) {
        activeEntityAliases.add(alias);
      }
    }
  }

  return {
    normalizedQuestion,
    requestedYears: normalizedQuestion.match(/\b(?:19|20)\d{2}\b/g) ?? [],
    asksWhen: /\bwhen\b/.test(normalizedQuestion),
    asksWhere: /\bwhere\b|\blive\b|\blived\b|\bhome\b|\bbased\b|\blocation\b|\bmap\b/.test(normalizedQuestion),
    asksWho: /\bwho\b/.test(normalizedQuestion),
    asksWhy: /\bwhy\b/.test(normalizedQuestion),
    asksHow: /\bhow\b/.test(normalizedQuestion),
    mentionsMarriage: /\bmarry\b|\bmarried\b|\bwedding\b|\bwed\b/.test(normalizedQuestion),
    mentionsBirth: /\bborn\b|\bbirth\b|\barrived\b/.test(normalizedQuestion),
    mentionsDeath: /\bdie\b|\bdied\b|\bdeath\b|\bpassed away\b/.test(normalizedQuestion),
    mentionsEducation: /\bdoctorate\b|\bphd\b|\bph d\b|\bgraduat\b|\bdegree\b|\bcommencement\b/.test(normalizedQuestion),
    activeEntityAliases: [...activeEntityAliases],
  };
}

function containsDateLike(text: string) {
  return /\b(january|february|march|april|may|june|july|august|september|october|november|december|christmas|easter|mother s day|spring|summer|fall|autumn)\b|\b(?:19|20)\d{2}\b|\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|twenty first|twenty second|twenty third|twenty fourth|twenty fifth|twenty sixth|twenty seventh|twenty eighth|twenty ninth|thirtieth|thirty first)\b/.test(
    text,
  );
}

function containsLocationLike(text: string) {
  return /\b(in|at|near|from|to)\b/.test(text) && /\b(virginia|north carolina|south carolina|pennsylvania|new jersey|texas|germany|switzerland|ethiopia|sudan|rwanda|thailand|kuwait|lexington|richmond|roanoke|chapel hill|high point|newport news|wurzburg|würzburg|lungern|nyon|geneva)\b/.test(
    text,
  );
}

function scoreText(text: string, source: string, questionProfile: QuestionProfile, terms: string[], kind: Passage["kind"], year?: number) {
  const normalizedText = normalize(text);
  const normalizedSource = normalize(source);
  let score = 0;

  for (const term of terms) {
    if (normalizedText.includes(term)) {
      score += 3;
    }
    if (normalizedSource.includes(term)) {
      score += 2;
    }
  }

  if (questionProfile.activeEntityAliases.length > 0) {
    const entityHits = questionProfile.activeEntityAliases.filter(
      (alias) => normalizedText.includes(alias) || normalizedSource.includes(alias),
    ).length;

    if (entityHits > 0) {
      score += 6 + entityHits * 2;
    } else {
      score -= 6;
    }
  }

  for (const yearText of questionProfile.requestedYears) {
    if (normalizedText.includes(yearText) || normalizedSource.includes(yearText)) {
      score += 4;
    }
  }

  if (
    questionProfile.requestedYears.length > 0 &&
    !questionProfile.requestedYears.some((yearText) => normalizedText.includes(yearText) || normalizedSource.includes(yearText))
  ) {
    score -= 3;
  }

  if (year && questionProfile.normalizedQuestion.includes(String(year))) {
    score += 4;
  }

  if (questionProfile.asksWhen) {
    score += containsDateLike(normalizedText) ? 7 : -2;
    score += kind === "letter" ? 3 : 0;
  }

  if (questionProfile.asksWhere) {
    score += kind === "place" ? 5 : 0;
    score += containsLocationLike(normalizedText) ? 5 : -1;
  }

  if (questionProfile.asksWho) {
    score += /\bis\b|\bwas\b|\bdaughter\b|\bson\b|\bwife\b|\bhusband\b/.test(normalizedText) ? 4 : 0;
  }

  if (questionProfile.mentionsMarriage) {
    score += /\bmarry\b|\bmarried\b|\bwedding\b|\bwed\b/.test(normalizedText) ? 7 : -2;
  }

  if (questionProfile.mentionsBirth) {
    score += /\bborn\b|\bbirth\b|\bbabe\b|\barrived\b/.test(normalizedText) ? 6 : -1;
  }

  if (questionProfile.mentionsDeath) {
    score += /\bdie\b|\bdied\b|\bdeath\b|\bpassed away\b/.test(normalizedText) ? 6 : -1;
  }

  if (questionProfile.mentionsEducation) {
    score += /\bdoctorate\b|\bphd\b|\bph d\b|\bgraduat\b|\bdegree\b|\bcommencement\b/.test(normalizedText) ? 6 : -1;
  }

  if (questionProfile.normalizedQuestion.includes("mother s day 1973") && normalizedSource.includes("1973 letter")) {
    score += 6;
  }

  if (questionProfile.normalizedQuestion.includes("313 jackson avenue") && normalizedText.includes("313 jackson avenue")) {
    score += 6;
  }

  return score;
}

function buildEvidenceSnippet(passage: Passage, questionProfile: QuestionProfile, terms: string[]) {
  const sentences = splitIntoSentences(passage.text);
  if (sentences.length <= 1) {
    return passage.text.trim();
  }

  const rankedSentences = sentences
    .map((sentence, index) => ({
      index,
      sentence,
      score: scoreText(sentence, passage.source, questionProfile, terms, passage.kind, passage.year),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const bestSentence = rankedSentences[0];
  if (!bestSentence || bestSentence.score <= 0) {
    return sentences.slice(0, 2).join(" ").trim();
  }

  const selectedIndexes = new Set([bestSentence.index]);
  for (const candidate of rankedSentences.slice(1)) {
    if (
      Math.abs(candidate.index - bestSentence.index) === 1 &&
      candidate.score >= Math.max(2, bestSentence.score - 5)
    ) {
      selectedIndexes.add(candidate.index);
    }
  }

  return [...selectedIndexes]
    .sort((a, b) => a - b)
    .map((index) => sentences[index])
    .join(" ")
    .trim();
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
      source: `${letter.year} letter (${letter.date})`,
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

function scorePassage(passage: Passage, questionProfile: QuestionProfile, terms: string[]) {
  return scoreText(passage.text, passage.source, questionProfile, terms, passage.kind, passage.year);
}

function buildUnableToAnswerMessage() {
  return "I couldn’t find a reliable answer to that in the letters and story on this site.";
}

function fallbackAnswer(question: string) {
  const terms = extractTerms(question);
  const questionProfile = detectQuestionProfile(question);
  const ranked = PASSAGES
    .map((passage) => ({
      passage,
      score: scorePassage(passage, questionProfile, terms),
      snippet: buildEvidenceSnippet(passage, questionProfile, terms),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.passage.sourceOrder - b.passage.sourceOrder);

  const topScore = ranked[0]?.score ?? 0;
  const secondScore = ranked[1]?.score ?? 0;
  const isFactQuestion =
    questionProfile.asksWho ||
    questionProfile.asksWhen ||
    questionProfile.asksWhere ||
    questionProfile.mentionsMarriage ||
    questionProfile.mentionsBirth ||
    questionProfile.mentionsDeath ||
    questionProfile.mentionsEducation;

  const uniqueSources = new Set<string>();
  const topMatches = ranked.filter((entry) => {
    if (uniqueSources.has(entry.passage.source)) return false;
    uniqueSources.add(entry.passage.source);
    return true;
  }).slice(0, 3);

  if (topMatches.length === 0) {
    return buildUnableToAnswerMessage();
  }

  if (topScore < 12) {
    return buildUnableToAnswerMessage();
  }

  if (isFactQuestion && topScore < 18) {
    return buildUnableToAnswerMessage();
  }

  if (isFactQuestion && topScore - secondScore < 3) {
    return buildUnableToAnswerMessage();
  }

  const useSingleLead =
    topMatches.length === 1 || topMatches[0].score >= (topMatches[1]?.score ?? 0) + 5;

  const intro = useSingleLead
    ? "The clearest answer I found in the archive is:"
    : "Here are the strongest references I found in the archive:";

  const body = topMatches
    .map(({ passage, snippet }, index) => {
      const lead = useSingleLead && index === 1 ? "Supporting reference:\n\n" : "";
      return `${lead}**${passage.source}**\n${snippet}`;
    })
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
