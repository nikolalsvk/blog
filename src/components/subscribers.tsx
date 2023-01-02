import React, { useState, useEffect } from "react"

export const Subscribers = () => {
  const [subscriberCount, setSubscriberCount] = useState<null | number>(null)

  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const data = await fetch(
          `${process.env.GATSBY_FUNCTION_HOST}/.netlify/functions/convertkit`
        )

        const json = await data.json()

        setSubscriberCount(json.subscriberCount)
      } catch (error) {
        console.error(error)
        console.error(
          "Failed to fetch subscriber count, are you running `netlify dev`?"
        )
      }
    }

    fetchSubscriberCount()
  }, [])

  if (subscriberCount === null) {
    return <>...</>
  }

  return <>{subscriberCount}</>
}
