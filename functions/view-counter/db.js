const { initializeApp, cert } = require("firebase-admin/app")
const { getDatabase } = require("firebase-admin/database")

const app = initializeApp({
  credential: cert(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)),
  databaseURL: `https://${process.env.FIREBASE_DB}.firebaseio.com`,
  databaseAuthVariableOverride: {
    uid: "view-counter-function",
  },
})

module.exports = getDatabase(app)
