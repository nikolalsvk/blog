const admin = require("firebase-admin")
const { join } = require("path")

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
  ),
  databaseURL: `https://${process.env.FIREBASE_DB}.firebaseio.com`,
})

module.exports = admin.database()
