import { describe, expect, it } from "vitest";
import { getSqlPatchColumns } from "../src/utils/database.js";

describe("getSqlPatchColumns", () => {
  it("returns correct SET clause and args for basic input", () => {
    const [set, args] = getSqlPatchColumns([
      ["name", "Test organization"],
      ["country_code", "HR"],
    ]);

    expect(set).toBe("name = $1, country_code = $2");
    expect(args).toEqual(["Test organization", "HR"]);
  });

  it("filters out null and undefined values", () => {
    const [set, args] = getSqlPatchColumns([
      ["name", "Test organization"],
      ["country_code", null],
      ["city", undefined],
      ["zip", "12345"],
    ]);

    expect(set).toBe("name = $1, zip = $2");
    expect(args).toEqual(["Test organization", "12345"]);
  });

  it("handles empty input", () => {
    const [set, args] = getSqlPatchColumns([]);

    expect(set).toBe("");
    expect(args).toEqual([]);
  });

  it("appends extraArgs at the end", () => {
    const [set, args] = getSqlPatchColumns(
      [
        ["name", "Test organization"],
        ["country_code", "HR"],
      ],
      42,
      "extra"
    );

    expect(set).toBe("name = $1, country_code = $2");
    expect(args).toEqual(["Test organization", "HR", 42, "extra"]);
  });

  it("works with numbers and strings", () => {
    const [set, args] = getSqlPatchColumns([
      ["count", 5],
      ["label", "foo"],
    ]);

    expect(set).toBe("count = $1, label = $2");
    expect(args).toEqual([5, "foo"]);
  });
});
