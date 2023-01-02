import { Database } from "firebase/database"

export default async function loadDb(): Promise<Database> {
  const { initializeApp } = await import("firebase/app")

  const { getDatabase } = await import("firebase/database")

  const firebaseConfig = JSON.parse(process.env.GATSBY_FIREBASE_CONFIG || "{}")

  try {
    initializeApp(firebaseConfig)
  } catch (error) {
    let message, stack
    if (error instanceof Error) {
      message = error.message
    } else {
      message = String(error)
      stack = message
    }

    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/.test(message)) {
      console.error("Firebase initialization error", stack)
    }
  }

  return getDatabase()
}
