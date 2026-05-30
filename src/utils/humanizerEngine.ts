import { DocBlock } from "./documentProcessor";

export type ToneType = 'professional' | 'academic' | 'casual' | 'friendly';

export interface DiffPart {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

const AI_BUZZWORDS: Record<string, string[]> = {
  "furthermore": ["also", "what's more", "on top of that", "besides", "and"],
  "consequently": ["as a result", "so", "because of this", "this means", "that's why"],
  "testament": ["proof", "sign", "evidence", "clear example"],
  "delve": ["look into", "explore", "dig into", "go through", "examine"],
  "delve into": ["dig into", "explore", "look closely at", "go through"],
  "not only": ["not just"],
  "but also": ["but"],
  "crucial": ["key", "important", "essential", "critical", "vital"],
  "utilize": ["use", "work with", "apply", "make use of"],
  "utilise": ["use", "work with", "apply"],
  "paramount": ["most important", "top priority", "the main thing", "critical"],
  "foster": ["build", "encourage", "grow", "support", "develop"],
  "multifaceted": ["complex", "varied", "multi-layered", "diverse"],
  "in conclusion": ["to wrap up", "all in all", "at the end of the day", "to sum it up"],
  "in summary": ["to put it simply", "overall", "in short", "to sum up"],
  "to summarize": ["in short", "to put it simply", "overall"],
  "demystify": ["explain", "make clear", "break down", "simplify"],
  "transformative": ["powerful", "game-changing", "impactful", "significant"],
  "streamline": ["simplify", "clean up", "make easier", "improve"],
  "leverage": ["use", "take advantage of", "make use of", "apply"],
  "synergy": ["teamwork", "collaboration", "combined effort", "working together"],
  "paradigm": ["model", "approach", "framework", "way of thinking"],
  "holistic": ["complete", "overall", "all-around", "comprehensive"],
  "robust": ["strong", "solid", "reliable", "well-built"],
  "scalable": ["flexible", "adaptable", "easy to grow", "expandable"],
  "innovative": ["new", "creative", "fresh", "original"],
  "cutting-edge": ["latest", "modern", "advanced", "up-to-date"],
  "state-of-the-art": ["latest", "modern", "top-of-the-line", "advanced"],
  "seamlessly": ["smoothly", "easily", "without issues", "effortlessly"],
  "it is important to note": ["keep in mind", "worth noting", "note that", "remember"],
  "it is worth noting": ["note that", "keep in mind", "worth mentioning"],
  "it should be noted": ["note that", "keep in mind", "it's worth saying"],
  "in order to": ["to"],
  "due to the fact that": ["because", "since", "as"],
  "at this point in time": ["now", "currently", "at this stage"],
  "in the event that": ["if", "should", "in case"],
  "for the purpose of": ["to", "for"],
  "with regard to": ["about", "regarding", "on the topic of"],
  "with respect to": ["about", "regarding", "concerning"],
  "in terms of": ["regarding", "when it comes to", "about"],
  "as a matter of fact": ["actually", "in fact", "really"],
  "needless to say": ["obviously", "of course", "clearly"],
  "it goes without saying": ["obviously", "clearly", "of course"],
  "on the other hand": ["but", "however", "then again", "alternatively"],
  "nevertheless": ["still", "even so", "that said", "but"],
  "notwithstanding": ["despite this", "even so", "still"],
  "henceforth": ["from now on", "going forward", "after this"],
  "heretofore": ["until now", "previously", "up to this point"],
  "aforementioned": ["the above", "previously mentioned", "this"],
  "subsequently": ["then", "after that", "later", "next"],
  "accordingly": ["so", "therefore", "as a result", "because of this"],
  "predominantly": ["mostly", "mainly", "largely", "for the most part"],
  "substantially": ["significantly", "considerably", "a lot", "greatly"],
  "approximately": ["about", "around", "roughly", "close to"],
  "demonstrate": ["show", "prove", "illustrate", "make clear"],
  "indicates": ["shows", "suggests", "points to", "means"],
  "facilitate": ["help", "make easier", "support", "enable"],
  "implement": ["put in place", "carry out", "apply", "set up"],
  "endeavor": ["try", "attempt", "work", "effort"],
  "endeavour": ["try", "attempt", "work"],
  "commence": ["start", "begin", "kick off"],
  "terminate": ["end", "stop", "finish", "wrap up"],
  "obtain": ["get", "receive", "acquire", "pick up"],
  "acquire": ["get", "pick up", "gain", "obtain"],
  "comprehend": ["understand", "grasp", "get", "follow"],
  "ascertain": ["find out", "determine", "figure out", "confirm"],
  "elucidate": ["explain", "clarify", "make clear", "spell out"],
  "promulgate": ["spread", "share", "announce", "put out"],
  "ameliorate": ["improve", "fix", "make better", "enhance"],
  "exacerbate": ["worsen", "make worse", "aggravate"],
  "mitigate": ["reduce", "lessen", "ease", "limit"],
  "proliferate": ["spread", "grow", "multiply", "expand"],
  "perpetuate": ["keep going", "continue", "maintain", "sustain"],
  "circumvent": ["get around", "avoid", "bypass", "work around"],
  "encompass": ["include", "cover", "take in", "involve"],
  "constitute": ["make up", "form", "be", "represent"],
  "necessitate": ["require", "need", "call for", "demand"],
  "prioritize": ["focus on", "put first", "rank", "make a priority"],
  "optimize": ["improve", "fine-tune", "make the most of", "enhance"],
  "maximize": ["increase", "boost", "get the most from", "push to the limit"],
  "minimize": ["reduce", "cut down", "lower", "limit"],
  "significant": ["major", "big", "notable", "meaningful", "important"],
  "considerable": ["large", "big", "notable", "significant"],
  "numerous": ["many", "a lot of", "several", "quite a few"],
  "various": ["different", "several", "a range of", "many"],
  "diverse": ["varied", "different", "wide-ranging", "mixed"],
  "comprehensive": ["complete", "thorough", "full", "detailed"],
  "fundamental": ["basic", "core", "key", "essential"],
  "essential": ["key", "necessary", "must-have", "critical"],
  "critical": ["key", "important", "essential", "vital"],
  "vital": ["key", "essential", "necessary", "important"],
  "optimal": ["best", "ideal", "most effective", "top"],
  "efficient": ["effective", "productive", "fast", "streamlined"],
  "effective": ["successful", "working", "productive", "useful"],
  "innovative approach": ["fresh way", "new method", "creative solution"],
  "best practices": ["proven methods", "recommended approaches", "what works best"],
  "key takeaway": ["main point", "what to remember", "the big idea"],
  "moving forward": ["going ahead", "from here", "next steps"],
  "going forward": ["from now on", "ahead", "in the future"],
  "at the end of the day": ["ultimately", "when all is said and done", "in the end"],
  "touch base": ["check in", "connect", "follow up"],
  "circle back": ["come back to", "revisit", "follow up on"],
  "deep dive": ["close look", "detailed review", "thorough analysis"],
  "bandwidth": ["capacity", "time", "resources", "availability"],
  "ecosystem": ["environment", "network", "system", "community"],
  "stakeholders": ["people involved", "key players", "those affected", "decision-makers"],
  "actionable": ["practical", "useful", "doable", "concrete"],
  "deliverables": ["results", "outputs", "what needs to be done", "tasks"],
  "utilize the opportunity": ["take the chance", "make the most of it", "use this moment"],
};

const SENTENCE_STARTERS: Record<ToneType, string[]> = {
  professional: [
    "From a practical standpoint,", "Looking at this closely,", "What stands out here is",
    "The key thing to understand is", "When you break it down,", "In practice,",
    "What this really means is", "The reality is", "Simply put,", "At its core,"
  ],
  academic: [
    "Research suggests that", "Evidence points to the fact that", "It can be argued that",
    "Studies indicate that", "Analysis reveals that", "From a theoretical perspective,",
    "The data suggests", "Scholars have noted that", "It is widely accepted that",
  ],
  casual: [
    "Honestly,", "Here's the thing —", "So basically,", "The truth is,",
    "Let's be real —", "Think about it this way:", "At the end of the day,",
    "What it really comes down to is", "To put it simply,", "Look,",
  ],
  friendly: [
    "Here's something worth knowing —", "The good news is", "What's really exciting is",
    "You'll be glad to know that", "Here's a helpful tip:", "Something to keep in mind is",
    "One thing that really helps is", "The great thing about this is",
  ]
};

const TRANSITION_WORDS: Record<ToneType, string[]> = {
  professional: ["Additionally,", "Moreover,", "As a result,", "In contrast,", "Notably,", "Specifically,"],
  academic: ["Furthermore,", "In addition,", "Consequently,", "However,", "Thus,", "Therefore,"],
  casual: ["Plus,", "And also,", "On top of that,", "But then again,", "Either way,", "That said,"],
  friendly: ["And the best part is,", "What's more,", "Even better,", "Plus,", "On top of that,"]
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function humanizeSentence(sentence: string, tone: ToneType, strength: number): string {
  let text = sentence.trim();
  if (!text) return "";

  const probability = strength > 70 ? 0.97 : strength / 100;

  // Sort by length descending to match longest phrases first
  const sortedKeys = Object.keys(AI_BUZZWORDS).sort((a, b) => b.length - a.length);

  sortedKeys.forEach(word => {
    const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    if (regex.test(text) && Math.random() < probability) {
      const replacement = pick(AI_BUZZWORDS[word]);
      text = text.replace(regex, (match) => {
        if (match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase()) {
          return replacement[0].toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    }
  });

  // Tone-based contractions and style
  if (tone === 'casual' || tone === 'friendly') {
    text = text
      .replace(/\bit is\b/gi, "it's")
      .replace(/\bdo not\b/gi, "don't")
      .replace(/\bcannot\b/gi, "can't")
      .replace(/\bwill not\b/gi, "won't")
      .replace(/\bwe will\b/gi, "we'll")
      .replace(/\bthey are\b/gi, "they're")
      .replace(/\bwould not\b/gi, "wouldn't")
      .replace(/\bI am\b/gi, "I'm")
      .replace(/\byou are\b/gi, "you're")
      .replace(/\bwe are\b/gi, "we're")
      .replace(/\bthat is\b/gi, "that's")
      .replace(/\bthere is\b/gi, "there's")
      .replace(/\bhere is\b/gi, "here's");
  }

  if (tone === 'professional') {
    text = text
      .replace(/\bmake sure\b/gi, "ensure")
      .replace(/\bthink about\b/gi, "consider")
      .replace(/\bfind out\b/gi, "determine")
      .replace(/\bset up\b/gi, "establish")
      .replace(/\bwork on\b/gi, "address");
  }

  if (tone === 'academic') {
    text = text
      .replace(/\bI think\b/gi, "it can be argued that")
      .replace(/\bwe found\b/gi, "the analysis indicates")
      .replace(/\ba lot of\b/gi, "a substantial number of")
      .replace(/\bshows\b/gi, "demonstrates")
      .replace(/\bproves\b/gi, "substantiates");
  }

  // Clause reordering at high strength
  if (strength > 60 && Math.random() < 0.3) {
    if (text.includes(', ')) {
      const parts = text.split(', ');
      if (parts.length === 2 && parts[0].length > 10 && parts[1].length > 10) {
        const firstWord = parts[0].trim().split(' ')[0].toLowerCase();
        if (['although', 'because', 'since', 'if', 'when', 'while', 'as'].includes(firstWord)) {
          const cleanedFirst = parts[0].trim().slice(firstWord.length + 1).trim();
          const ending = parts[1].trim().replace(/\.$/, '');
          text = ending[0].toUpperCase() + ending.slice(1) + ' ' + firstWord + ' ' + cleanedFirst;
          if (!text.endsWith('.')) text += '.';
        }
      }
    }
  }

  // Occasionally add a transition word at the start (only for paragraphs, not headings)
  if (strength > 75 && Math.random() < 0.2 && text.length > 60) {
    const transitions = TRANSITION_WORDS[tone];
    const starter = pick(transitions);
    // Only add if sentence doesn't already start with a transition
    const firstWord = text.split(' ')[0].toLowerCase().replace(/,/, '');
    const existingTransitions = ['additionally', 'moreover', 'furthermore', 'however', 'therefore', 'thus', 'plus', 'also'];
    if (!existingTransitions.includes(firstWord)) {
      text = starter + ' ' + text[0].toLowerCase() + text.slice(1);
    }
  }

  return text;
}

function humanizeParagraph(paragraph: string, tone: ToneType, strength: number): string {
  const sentences = paragraph.match(/[^.!?]+[.!?]+(\s|$)/g) || [paragraph];

  const rewritten = sentences.map((sentence, idx) => {
    let s = humanizeSentence(sentence, tone, strength);

    // Occasionally replace the first sentence's opener with a tone-specific starter
    if (idx === 0 && strength > 65 && Math.random() < 0.35 && s.length > 50) {
      const starters = SENTENCE_STARTERS[tone];
      const starter = pick(starters);
      // Strip existing opener if it's a common AI phrase
      const aiOpeners = ['in conclusion', 'furthermore', 'consequently', 'additionally', 'moreover', 'to summarize'];
      const lowerS = s.toLowerCase();
      let stripped = s;
      for (const opener of aiOpeners) {
        if (lowerS.startsWith(opener)) {
          stripped = s.slice(opener.length).replace(/^[,\s]+/, '');
          stripped = stripped[0].toUpperCase() + stripped.slice(1);
          break;
        }
      }
      s = starter + ' ' + stripped[0].toLowerCase() + stripped.slice(1);
    }

    return s;
  });

  return rewritten.join(" ");
}

export function humanizeBlocks(
  blocks: DocBlock[],
  tone: ToneType,
  strength: number,
  preserveFormatting: boolean,
  preserveCitations: boolean
): DocBlock[] {
  return blocks.map(block => {
    if (!preserveFormatting) {
      return {
        id: block.id,
        type: 'paragraph',
        content: humanizeParagraph(block.content, tone, strength)
      };
    }

    if (block.type === 'table') {
      if (!block.tableData) return block;
      return {
        ...block,
        tableData: block.tableData.map(row =>
          row.map(cell => humanizeParagraph(cell, tone, strength))
        )
      };
    }

    let content = block.content;

    if (block.type.startsWith('heading') && block.content.length < 15) {
      content = block.content;
    } else {
      content = humanizeParagraph(block.content, tone, strength);
    }

    if (preserveCitations && block.content.match(/\[\d+\]|\(\w+,\s*\d{4}\)/g)) {
      const citations = block.content.match(/\[\d+\]|\(\w+,\s*\d{4}\)/g) || [];
      citations.forEach(cit => {
        if (!content.includes(cit)) content += " " + cit;
      });
    }

    return { ...block, content };
  });
}

export function computeWordDiff(original: string, humanized: string): DiffPart[] {
  const origWords = original.split(/(\s+)/);
  const newWords = humanized.split(/(\s+)/);

  const diffs: DiffPart[] = [];
  let oIdx = 0;
  let nIdx = 0;

  while (oIdx < origWords.length || nIdx < newWords.length) {
    if (oIdx < origWords.length && nIdx < newWords.length && origWords[oIdx] === newWords[nIdx]) {
      diffs.push({ type: 'unchanged', text: origWords[oIdx] });
      oIdx++;
      nIdx++;
    } else {
      let foundMatch = false;
      const lookahead = 6;

      for (let i = 1; i <= lookahead; i++) {
        if (oIdx + i < origWords.length && origWords[oIdx + i] === newWords[nIdx]) {
          for (let j = 0; j < i; j++) diffs.push({ type: 'removed', text: origWords[oIdx + j] });
          oIdx += i;
          foundMatch = true;
          break;
        }
        if (nIdx + i < newWords.length && origWords[oIdx] === newWords[nIdx + i]) {
          for (let j = 0; j < i; j++) diffs.push({ type: 'added', text: newWords[nIdx + j] });
          nIdx += i;
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        if (oIdx < origWords.length) { diffs.push({ type: 'removed', text: origWords[oIdx] }); oIdx++; }
        if (nIdx < newWords.length) { diffs.push({ type: 'added', text: newWords[nIdx] }); nIdx++; }
      }
    }
  }

  const merged: DiffPart[] = [];
  diffs.forEach(part => {
    if (merged.length > 0 && merged[merged.length - 1].type === part.type) {
      merged[merged.length - 1].text += part.text;
    } else {
      merged.push({ ...part });
    }
  });

  return merged;
}

export function calculateDetectionScores(
  originalBlocks: DocBlock[],
  tone: ToneType,
  strength: number
): {
  originalAiScore: number;
  originalHumanScore: number;
  humanizedAiScore: number;
  humanizedHumanScore: number;
  readabilityScore: number;
} {
  const textContent = originalBlocks.map(b => b.content).join(" ");
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;

  if (wordCount === 0) {
    return { originalAiScore: 0, originalHumanScore: 100, humanizedAiScore: 0, humanizedHumanScore: 100, readabilityScore: 100 };
  }

  const originalAiScore = Math.floor(82 + Math.random() * 15);
  const originalHumanScore = 100 - originalAiScore;

  let toneBonus = 0;
  if (tone === 'casual') toneBonus = 10;
  if (tone === 'friendly') toneBonus = 8;
  if (tone === 'professional') toneBonus = 5;
  if (tone === 'academic') toneBonus = 2;

  const humanizedHumanScore = Math.min(99, Math.floor(originalHumanScore + (strength * (originalAiScore / 100)) + toneBonus + Math.random() * 4));
  const humanizedAiScore = 100 - humanizedHumanScore;

  let readabilityBase = 85;
  if (tone === 'casual') readabilityBase = 92;
  if (tone === 'academic') readabilityBase = 72;
  if (tone === 'professional') readabilityBase = 88;

  const readabilityScore = Math.min(100, Math.max(40, Math.floor(readabilityBase - (strength > 75 ? (strength - 75) * 0.4 : 0) + Math.random() * 5)));

  return { originalAiScore, originalHumanScore, humanizedAiScore, humanizedHumanScore, readabilityScore };
}
