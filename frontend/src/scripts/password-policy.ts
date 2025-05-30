const lowercaseRegEx = /[a-z]/;
const uppercaseRegEx = /[A-Z]/;
const numberRegEx = /[0-9]/;
const symbolRegEx = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

const passwordStrengths = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
const passwordScale = 6;

function isVariedCase(text: string): boolean {
  return lowercaseRegEx.test(text) && uppercaseRegEx.test(text);
}

function measurePasswordStrength(password: string): number {
  return (
    Math.floor(password.length / passwordScale)
    + +isVariedCase(password)
    + +numberRegEx.test(password)
    + +symbolRegEx.test(password)
  );
}

export function getPasswordStrength(password: string): PasswordStrength {
  const strength = measurePasswordStrength(password);
  const title = passwordStrengths[Math.min(strength, passwordStrengths.length - 1)];

  return {
    title: title,
    strength: strength,
  };
}

export type PasswordStrength = {
  title: string
  strength: number
};
