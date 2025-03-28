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
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
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
