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
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
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
