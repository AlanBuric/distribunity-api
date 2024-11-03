export function validateConfigValue(name: string): string {
    if (process.env[name]) {
        return process.env[name];
    }

    throw new Error(`Environment variable value ${name} is missing from the .env config`);
}