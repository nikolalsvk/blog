import React, { useEffect } from "react"

// import loadDb from "../utils/firebase-db"

import Views from "./views"

interface Props {
  slug: string
  hideText?: boolean
}

function ViewCounter({ slug, hideText }: Props) {
  /*
  const [views, setViews] = useState("")

  // Subscribe to view count updates
  useEffect(() => {
    const onViews = (newViews: { val: () => string }) =>
      setViews(newViews.val())
    let db: firebase.database.Reference

    const fetchData = async () => {
      db = await loadDb()
      db.child(slug).on("value", onViews)
    }

    fetchData()

    return function cleanup() {
      db.child(slug).off("value", onViews)
    }
  }, [slug])
  */

  // Asynchronously log a view
  useEffect(() => {
    const registerView = () => {
      return fetch(
        `${process.env.GATSBY_FUNCTION_HOST}/.netlify/functions/view-counter`,
        {
          method: "POST",
          body: JSON.stringify({ slug: slug }),
        }
      ).catch((error) =>
        console.log("Failed to fetch page views with error:", error)
      )
    }

    registerView()
  }, [slug])

  // Returning 0 until I decide to show views on blog posts again
  return hideText ? null : <Views views="0" />
}

export default ViewCounter
