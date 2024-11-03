import {UUID} from "crypto";
import {Country, Organization, User} from "../types/database-types.js";
import {Low, Memory} from "lowdb";

export type DatabaseSchema = {
    users: Record<UUID, User>;
    countries: Record<string, Country>;
    organizations: Record<UUID, Organization>;
}

let mockDatabase: Low<DatabaseSchema> | undefined;

export function getDefaultData(): DatabaseSchema {
    return {
        users: {},
        countries: {
            "hr": {
                name: "Croatia"
            },
            "us": {
                name: "United States"
            }
        },
        organizations: {}
    };
}

export function connectDatabase() {
    mockDatabase = new Low<DatabaseSchema>(new Memory<DatabaseSchema>(), getDefaultData());
    return mockDatabase.read();
}

export function saveDatabase() {
    if (!mockDatabase) {
        throw new Error("Database is uninitialized, call connectDatabase() beforehand");
    }

    return mockDatabase.write();
}

export default function getDatabase(): Low<DatabaseSchema> {
    if (!mockDatabase) {
        throw new Error("Database is uninitialized, call connectDatabase() beforehand");
    }

    return mockDatabase;
}