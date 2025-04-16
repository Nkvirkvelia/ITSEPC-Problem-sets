import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 *
 * Empty input → Returns an empty array.
 * Single bucket → Maps a single flashcard correctly.
 * Multiple buckets → Ensures correct ordering of flashcards.
 * Buckets with gaps → Includes empty sets for missing buckets.
 * High bucket index → Fills missing intermediate buckets with empty sets.
 *
 */
describe("toBucketSets", () => {
  it("should return an empty array when the input is an empty map", () => {
    const buckets: BucketMap = new Map();
    assert.deepStrictEqual(toBucketSets(buckets), []);
  });

  it("should correctly handle a single bucket with one flashcard", () => {
    const flashcard = new Flashcard("Q1", "A1", "Hint1", []);
    const buckets: BucketMap = new Map([[0, new Set([flashcard])]]);

    assert.deepStrictEqual(toBucketSets(buckets), [new Set([flashcard])]);
  });

  it("should correctly handle multiple buckets with flashcards", () => {
    const flashcard1 = new Flashcard("Q1", "A1", "Hint1", []);
    const flashcard2 = new Flashcard("Q2", "A2", "Hint2", []);
    const buckets: BucketMap = new Map([
      [0, new Set([flashcard1])],
      [1, new Set([flashcard2])],
    ]);

    assert.deepStrictEqual(toBucketSets(buckets), [
      new Set([flashcard1]),
      new Set([flashcard2]),
    ]);
  });

  it("should include empty sets for missing bucket numbers", () => {
    const flashcard1 = new Flashcard("Q1", "A1", "Hint1", []);
    const flashcard2 = new Flashcard("Q2", "A2", "Hint2", []);
    const buckets: BucketMap = new Map([
      [0, new Set([flashcard1])],
      [2, new Set([flashcard2])], // Bucket 1 is missing
    ]);

    assert.deepStrictEqual(toBucketSets(buckets), [
      new Set([flashcard1]),
      new Set(), // Empty set for missing bucket 1
      new Set([flashcard2]),
    ]);
  });

  it("should correctly handle a case where the highest bucket number is large", () => {
    const flashcard = new Flashcard("Q1", "A1", "Hint1", []);
    const buckets: BucketMap = new Map([[5, new Set([flashcard])]]);

    assert.deepStrictEqual(toBucketSets(buckets), [
      new Set(),
      new Set(),
      new Set(),
      new Set(),
      new Set(),
      new Set([flashcard]),
    ]);
  });
});

/*
 * Testing strategy for getBucketRange():
 *
 * Empty buckets: Ensure function returns undefined when no flashcards exist.
 * Single non-empty bucket: Check if function correctly identifies when only one bucket contains flashcards.
 * Multiple non-empty buckets: Test cases where flashcards exist in different non-adjacent buckets.
 * All buckets filled: Ensure function correctly returns the entire range when all buckets contain flashcards.
 * Large gaps between filled buckets: Validate correct min and max range even when there are gaps between populated buckets.
 */
describe("getBucketRange()", () => {
  const card1 = new Flashcard("Front1", "Back1", "Hint1", ["tag1"]);
  const card2 = new Flashcard("Front2", "Back2", "Hint2", ["tag2"]);
  const card3 = new Flashcard("Front3", "Back3", "Hint3", ["tag3"]);

  it("returns undefined for empty buckets", () => {
    assert.deepStrictEqual(
      getBucketRange([new Set(), new Set(), new Set()]),
      undefined
    );
  });

  it("returns correct range for single non-empty bucket", () => {
    assert.deepStrictEqual(
      getBucketRange([new Set(), new Set([card1]), new Set()]),
      {
        minBucket: 1,
        maxBucket: 1,
      }
    );
  });

  it("returns correct range for multiple non-empty buckets", () => {
    assert.deepStrictEqual(
      getBucketRange([new Set([card1]), new Set(), new Set([card2])]),
      {
        minBucket: 0,
        maxBucket: 2,
      }
    );
  });

  it("handles all buckets being filled", () => {
    assert.deepStrictEqual(
      getBucketRange([new Set([card1]), new Set([card2]), new Set([card3])]),
      {
        minBucket: 0,
        maxBucket: 2,
      }
    );
  });

  it("handles a large gap between filled buckets", () => {
    assert.deepStrictEqual(
      getBucketRange([
        new Set(),
        new Set([card1]),
        new Set(),
        new Set(),
        new Set([card2]),
      ]),
      {
        minBucket: 1,
        maxBucket: 4,
      }
    );
  });
});

/*
 * Testing strategy for practice():
 *
 * - Always includes cards from bucket 0.
 * - Includes cards from bucket `n` if the given day is divisible by `2^n`.
 * The test cases verify:
 * 1. Empty Buckets Test: Ensures an empty input returns an empty set.
 * 2. Day 0 Test: Confirms that all cards are reviewed on day 0.
 * 3. Day 2 Test: Ensures cards from bucket 0 and bucket 1 (since 2 is divisible by `2^1`) are included.
 * 4. Day 4 Test: Ensures all cards are included when 4 is divisible by `2^2`.
 * 5. Day 8 Test: Checks that all buckets contribute cards when 8 is divisible by `2^1`, `2^2`, and `2^3`.
 * 6. Variable Bucket Sizes Test: Verifies correct handling of buckets with different numbers of cards.
 */
describe("practice()", () => {
  const card1 = new Flashcard("Front1", "Back1", "Hint1", ["tag1"]);
  const card2 = new Flashcard("Front2", "Back2", "Hint2", ["tag2"]);
  const card3 = new Flashcard("Front3", "Back3", "Hint3", ["tag3"]);

  it("returns empty set for empty buckets", () => {
    assert.deepStrictEqual(
      practice([new Set(), new Set(), new Set()], 0),
      new Set()
    );
  });

  it("returns all cards on day 0", () => {
    assert.deepStrictEqual(
      practice([new Set([card1]), new Set([card2]), new Set([card3])], 0),
      new Set([card1, card2, card3])
    );
  });

  it("returns bucket 0 and bucket 1 cards on day 2", () => {
    assert.deepStrictEqual(
      practice([new Set([card1]), new Set([card2]), new Set([card3])], 2),
      new Set([card1, card2])
    );
  });

  it("returns all cards on day 4", () => {
    assert.deepStrictEqual(
      practice([new Set([card1]), new Set([card2]), new Set([card3])], 4),
      new Set([card1, card2, card3])
    );
  });

  it("returns bucket 0 and bucket 1 and bucket 2 cards on day 8", () => {
    assert.deepStrictEqual(
      practice([new Set([card1]), new Set([card2]), new Set([card3])], 8),
      new Set([card1, card2, card3])
    );
  });

  it("handles buckets with different lengths correctly", () => {
    assert.deepStrictEqual(
      practice([new Set([card1]), new Set(), new Set([card3])], 4),
      new Set([card1, card3])
    );
  });
});

/*
 * Testing strategy for update():
 *
 * Incorrect answer: Verifies the card is moved to bucket 0 when answered incorrectly.
 * Hard answer: Ensures the card stays in the same bucket when answered hard.
 * Easy answer: Confirms the card moves to the next bucket when answered easily.
 * Card not in any bucket: Tests that a new bucket (bucket 0) is created when the card is not found in any existing bucket.
 * Exceeding bucket 4: Ensures the card does not exceed bucket 4 when answered easily.
 */
describe("update()", () => {
  it("should move the card to bucket 0 when answered incorrectly", () => {
    const card = new Flashcard("What is 2+2?", "4", "Think simple", []);
    const buckets: BucketMap = new Map<number, Set<Flashcard>>([
      [0, new Set()],
      [1, new Set([card])],
      [2, new Set()],
    ]);

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Wrong);

    // Check if the card is in bucket 0
    assert(updatedBuckets.get(0)?.has(card), "Card should be in bucket 0");
    // Ensure the card is not in bucket 1
    assert(!updatedBuckets.get(1)?.has(card), "Card should not be in bucket 1");
  });

  it("should stay in the same bucket when answered hard", () => {
    const card = new Flashcard("What is 3+3?", "6", "Think simple", []);
    const buckets: BucketMap = new Map<number, Set<Flashcard>>([
      [1, new Set([card])],
      [2, new Set()],
    ]);

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Hard);

    // Check if the card is still in bucket 1
    assert(
      updatedBuckets.get(1)?.has(card),
      "Card should still be in bucket 1"
    );
    // Ensure the card is not in bucket 2
    assert(!updatedBuckets.get(2)?.has(card), "Card should not be in bucket 2");
  });

  it("should move the card to the next bucket when answered easily", () => {
    const card = new Flashcard("What is 5+5?", "10", "Think simple", []);
    const buckets: BucketMap = new Map<number, Set<Flashcard>>([
      [1, new Set([card])],
      [2, new Set()],
    ]);

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Easy);

    // Check if the card is now in bucket 2
    assert(updatedBuckets.get(2)?.has(card), "Card should be in bucket 2");
    // Ensure the card is no longer in bucket 1
    assert(!updatedBuckets.get(1)?.has(card), "Card should not be in bucket 1");
  });

  it("should create bucket 0 if the card is not found in any bucket", () => {
    const card = new Flashcard("What is 4+4?", "8", "Think simple", []);
    const buckets: BucketMap = new Map<number, Set<Flashcard>>([
      [1, new Set()],
      [2, new Set()],
    ]);

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Wrong);

    // Check if the card is added to bucket 0
    assert(updatedBuckets.get(0)?.has(card), "Card should be in bucket 0");
  });

  it("should not exceed bucket 4 when moving up", () => {
    const card = new Flashcard("What is 6+6?", "12", "Think simple", []);
    const buckets: BucketMap = new Map<number, Set<Flashcard>>([
      [3, new Set([card])],
      [4, new Set()],
    ]);

    const updatedBuckets = update(buckets, card, AnswerDifficulty.Easy);

    // Check if the card is in bucket 4
    assert(updatedBuckets.get(4)?.has(card), "Card should be in bucket 4");
    // Ensure the card is not in bucket 3
    assert(!updatedBuckets.get(3)?.has(card), "Card should not be in bucket 3");
  });
});

/*
 * Testing strategy for getHint():
 *
 * Valid hint: Varifies that the function returns the correct hint when provided
 * Empty Hint: Ensures that an empty hint is handled correctly
 * Missing Hint: Confirms that the function throws an error when the hint is missing
 * Single-Word Hint: Checks if a single-word hint is returned correctly
 */
describe("getHint()", () => {
  it("should return the correct hint for a flashcard", () => {
    const card = new Flashcard("What is 2 + 2?", "4", "Simple math", []);
    const hint = getHint(card);

    assert.strictEqual(hint, "Simple math", "The hint should be 'Simple math'");
  });

  it("should handle an empty hint", () => {
    const card = new Flashcard(
      "What is the capital of France?",
      "Paris",
      "",
      []
    );
    const hint = getHint(card);

    assert.strictEqual(hint, "", "The hint should be empty");
  });

  it("should throw an error if the hint is missing", () => {
    const card = new Flashcard(
      "What is 2+2?",
      "4",
      undefined as unknown as string,
      []
    );

    try {
      getHint(card);
      assert.fail("Expected an error to be thrown for missing hint");
    } catch (error: unknown) {
      // Type assertion for the error
      if (error instanceof Error) {
        assert.strictEqual(
          error.message,
          "Invalid flashcard or missing hint",
          "Expected error message for missing hint"
        );
      } else {
        // If it's not an instance of Error, we fail the test
        assert.fail("Expected an Error instance to be thrown");
      }
    }
  });

  it("should return the correct hint for a flashcard with a single-word hint", () => {
    const card = new Flashcard("What is 3 + 3?", "6", "Basic", []);
    const hint = getHint(card);

    assert.strictEqual(hint, "Basic", "The hint should be 'Basic'");
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * I tested computeProgress() across a variety of representative scenarios:
 *
 * 1. Empty input:
 *    - Both buckets and history are empty.
 *    - Ensures function handles no data gracefully.
 *
 * 2. Buckets with cards but empty history:
 *    - Verifies correct totalCards and bucket counts.
 *    - Checks that successRate is 0 when there's no history.
 *
 * 3. Buckets with cards and non-empty history:
 *    - Includes a mix of Easy, Hard, and incorrect answers.
 *    - Validates successRate calculation with weighted difficulties.
 *
 * 4. Invalid history:
 *    - Includes a card in history that’s not present in any bucket.
 *    - Ensures the function throws an appropriate error.
 *
 * This approach ensures correctness across normal, edge, and failure cases.
 */
describe("computeProgress()", () => {
  const cardA = new Flashcard("A", "a", "hint A", []);
  const cardB = new Flashcard("B", "b", "hint B", []);
  const cardC = new Flashcard("C", "c", "hint C", []);

  it("returns zero stats for empty inputs", () => {
    const buckets: BucketMap = new Map();
    expect(computeProgress(buckets, [])).toEqual({
      totalCards: 0,
      cardsInBuckets: {},
      successRate: 0,
    });
  });

  it("calculates totalCards and zero successRate with no history", () => {
    const buckets: BucketMap = new Map([
      [0, new Set([cardA, cardB])],
      [1, new Set([cardC])],
    ]);

    expect(computeProgress(buckets, [])).toEqual({
      totalCards: 3,
      cardsInBuckets: { 0: 2, 1: 1 },
      successRate: 0,
    });
  });

  it("computes correct stats with mixed history", () => {
    const buckets: BucketMap = new Map([
      [0, new Set([cardA, cardB])],
      [1, new Set([cardC])],
    ]);

    const history = [
      {
        card: cardA,
        isCorrect: true,
        difficulty: AnswerDifficulty.Easy,
        timestamp: 1,
      },
      {
        card: cardB,
        isCorrect: false,
        difficulty: AnswerDifficulty.Hard,
        timestamp: 2,
      },
      {
        card: cardC,
        isCorrect: true,
        difficulty: AnswerDifficulty.Hard,
        timestamp: 3,
      },
    ];

    // weightedCorrect = 1 (easy) + 2 (hard) = 3
    // weightedTotal = 1 (easy) + 2 (hard) = 3
    expect(computeProgress(buckets, history)).toEqual({
      totalCards: 3,
      cardsInBuckets: { 0: 2, 1: 1 },
      successRate: 1.0,
    });
  });

  it("throws error if card in history is not in any bucket", () => {
    const buckets: BucketMap = new Map([[0, new Set([cardA])]]);
    const history = [
      {
        card: cardB, // Not in bucket
        isCorrect: true,
        difficulty: AnswerDifficulty.Easy,
        timestamp: 1,
      },
    ];

    expect(() => computeProgress(buckets, history)).toThrow(
      "PracticeRecord card not found in any bucket."
    );
  });
});
