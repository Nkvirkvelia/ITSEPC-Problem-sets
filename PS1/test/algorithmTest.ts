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
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
