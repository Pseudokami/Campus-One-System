import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { seedDb } from "@/lib/backend/seed";
import type { ActionLog, BackendRecord, CampusDb, ResourceName, SchoolProfile, User } from "@/lib/backend/types";
import { resourceNames } from "@/lib/backend/types";

const dbPath = path.join(process.cwd(), "data", "campus-one-db.json");

const blankSchool = (userId: string): SchoolProfile => ({
  id: `school-${userId}`,
  name: "",
  representative: "",
  email: "",
  contactNumber: "",
  schoolType: "",
  targetSubdomain: "",
  status: "draft",
  setupProgress: 0,
});

async function ensureDb() {
  try {
    await readFile(dbPath, "utf8");
  } catch {
    await mkdir(path.dirname(dbPath), { recursive: true });
    await writeFile(dbPath, JSON.stringify(seedDb, null, 2));
  }
}

export async function readDb(): Promise<CampusDb> {
  await ensureDb();
  const content = await readFile(dbPath, "utf8");
  const db = JSON.parse(content) as CampusDb;
  if (!db.users) db.users = [];
  if (!db.schools) db.schools = {};
  return db;
}

export async function writeDb(db: CampusDb) {
  await mkdir(path.dirname(dbPath), { recursive: true });
  await writeFile(dbPath, JSON.stringify(db, null, 2));
}

export function isResourceName(value: string): value is ResourceName {
  return resourceNames.includes(value as ResourceName);
}

export async function getSchoolForUser(userId: string): Promise<SchoolProfile> {
  const db = await readDb();
  return db.schools[userId] ?? blankSchool(userId);
}

export async function updateSchoolForUser(userId: string, payload: Partial<SchoolProfile>): Promise<SchoolProfile> {
  const db = await readDb();
  const existing = db.schools[userId] ?? blankSchool(userId);
  db.schools[userId] = { ...existing, ...payload, id: existing.id };
  await writeDb(db);
  return db.schools[userId];
}

export async function listResource(resource: ResourceName, search?: string) {
  const db = await readDb();
  const rows = db[resource];
  const normalizedSearch = search?.trim().toLowerCase();

  if (!normalizedSearch) {
    return rows;
  }

  return rows.filter((row) =>
    Object.values(row).some((value) => value.toLowerCase().includes(normalizedSearch)),
  );
}

export async function createResource(resource: ResourceName, payload: BackendRecord) {
  const db = await readDb();
  const record = {
    id: payload.id || `${resource}-${Date.now()}`,
    ...payload,
  };

  db[resource] = [record, ...db[resource]];
  await writeDb(db);

  return record;
}

export async function updateResource(resource: ResourceName, id: string, payload: BackendRecord) {
  const db = await readDb();
  const index = db[resource].findIndex((row) => row.id === id);

  if (index === -1) {
    return null;
  }

  const updated = { ...db[resource][index], ...payload, id };
  db[resource][index] = updated;
  await writeDb(db);

  return updated;
}

export async function deleteResource(resource: ResourceName, id: string) {
  const db = await readDb();
  const currentCount = db[resource].length;
  db[resource] = db[resource].filter((row) => row.id !== id);

  if (db[resource].length === currentCount) {
    return false;
  }

  await writeDb(db);
  return true;
}

export async function logAction(module: string, label: string) {
  const db = await readDb();
  const action: ActionLog = {
    id: `action-${Date.now()}`,
    label,
    module,
    createdAt: new Date().toISOString(),
  };

  db.actionLogs = [action, ...db.actionLogs].slice(0, 20);
  db.activities = [`${label} clicked in ${module}`, ...db.activities].slice(0, 8);
  await writeDb(db);

  return action;
}

export async function findUser(email: string): Promise<User | null> {
  const db = await readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(email: string, password: string): Promise<User> {
  const db = await readDb();
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  db.users = [user, ...db.users];
  await writeDb(db);
  return user;
}
