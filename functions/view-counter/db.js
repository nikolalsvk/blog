const admin = require("firebase-admin")

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
  ),
  databaseURL: `https://${process.env.FIREBASE_DB}.firebaseio.com`,
  databaseAuthVariableOverride: {
    uid: "view-counter-function",
  },
})

module.exports = admin.database()
