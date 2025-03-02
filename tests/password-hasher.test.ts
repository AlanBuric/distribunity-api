import { describe, expect, it } from "vitest";
import PasswordHasher from "../src/utils/PasswordHasher.js";

describe("PasswordHasher class functions", () => {
  const passwordHasher = new PasswordHasher(16);
  const format =
    /^\$argon2id\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+(?:=*)?\$[A-Za-z0-9+/]+(?:=*)?$/;

  it("should hash a password and return an Argon2 formatted string", async () => {
    const password = "mySecurePassword";
    const hash = await passwordHasher.hashPassword(password);

    expect(hash).toMatch(format);
  });

  it("should verify the correct password", async () => {
    const password = "correctPassword";

    const hash = await passwordHasher.hashPassword(password);
    const isValid = await passwordHasher.verifyPassword(password, hash);

    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "correctPassword";

    const hash = await passwordHasher.hashPassword(password);
    const isValid = await passwordHasher.verifyPassword("wrongPassword", hash);

    expect(isValid).toBe(false);
  });

  it("should generate different hashes for the same password due to unique salts", async () => {
    const password = "repeatPassword";

    const hash1 = await passwordHasher.hashPassword(password);
    const hash2 = await passwordHasher.hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  it("should verify unique passwords even with different salts", async () => {
    const password1 = "passwordOne";
    const password2 = "passwordTwo";

    const isValid1 = await passwordHasher
      .hashPassword(password1)
      .then((hash) => passwordHasher.verifyPassword(password1, hash));
    const isValid2 = await passwordHasher
      .hashPassword(password2)
      .then((hash) => passwordHasher.verifyPassword(password2, hash));

    expect(isValid1).toBe(true);
    expect(isValid2).toBe(true);
  });
});
