import argon2 from "argon2";

export default class PasswordHasher {
  constructor(private hashLength = 16) {}

  /**
   * Hashes a password using argon2 with a random salt.
   * @param password - The plain text password to hash
   * @returns The hashed password as a single string
   */
  hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      hashLength: this.hashLength,
    });
  }

  /**
   * Verifies a password against a stored hash.
   * @param password - The plain text password to verify
   * @param hash - The stored hash to compare
   * @returns A boolean indicating if the password is correct
   */
  verifyPassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
