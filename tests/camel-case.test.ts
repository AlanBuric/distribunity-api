import { describe, test, expect } from "vitest";
import { camelCaseify, toCamelCase } from "../src/utils/database.js";

describe("toCamelCase function", () => {
  test("converts snake_case to camelCase", () => {
    expect(toCamelCase("first_name")).toBe("firstName");
    expect(toCamelCase("user_id")).toBe("userId");
    expect(toCamelCase("alreadyCamel")).toBe("alreadyCamel");
    expect(toCamelCase("a_b_c_d")).toBe("aBCD");
  });
});

describe("camelCaseify function", () => {
  test("converts all object keys from snake_case to camelCase", () => {
    const input = {
      first_name: "John",
      last_name: "Doe",
      user_id: 42,
      alreadyCamel: "ok",
    };

    const output = camelCaseify(input);

    expect(output).toEqual({
      firstName: "John",
      lastName: "Doe",
      userId: 42,
      alreadyCamel: "ok",
    });
  });
});
