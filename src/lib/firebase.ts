import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { type Firestore, getFirestore } from "firebase-admin/firestore";

let db: Firestore | undefined;

export function cargarCredenciales() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!json) return null;
  const parsed = JSON.parse(json) as {
    project_id: string;
    client_email: string;
    private_key: string;
  };
  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

export function firebaseConfigurado(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

export function getDb(): Firestore {
  if (db) return db;
  const cred = cargarCredenciales();
  if (!cred) throw new Error("Falta FIREBASE_SERVICE_ACCOUNT");
  const app =
    getApps()[0] ??
    initializeApp({ credential: cert(cred), projectId: cred.projectId });
  db = getFirestore(app);
  return db;
}
