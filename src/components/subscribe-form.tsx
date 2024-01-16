import React, { useState } from "react"
import styled from "styled-components"
import Spacer from "../components/spacer"
import * as Sentry from "@sentry/gatsby"

const Container = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;

  background-color: hsla(19, 76%, 97%, 1);
  border-radius: 5px;
  border: 1px solid var(--color-primary);

  h2 {
    margin: 0;
  }

  p {
    color: hsla(0, 0%, 33%, 1);
    width: 70%;
    text-align: center;
    line-height: 1.4;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 0;
  }

  input {
    width: 100%;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid var(--color-primary);
  }
`

const Submit = styled.button`
  margin: 0;
  width: 100%;
  color: rgb(255, 255, 255);
  background-image: linear-gradient(
    to top right,
    rgb(224, 109, 6),
    rgb(255, 167, 0)
  );
  border-radius: 3px;
  font-weight: 700;
  border: none;
  padding: 12px;
  cursor: pointer;
  transition: 0.5s;
  background-size: 200% auto;

  &:hover {
    background-position: right center;
  }
`

const TryAgain = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  cursor: pointer;
  box-shadow: 0 1px 0 0 currentColor;
  color: inherit;
`

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SubscribeForm = () => {
  const [status, setStatus] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const FORM_URL = `https://api.convertkit.com/v3/forms/1275610/subscribe`

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const payload = JSON.stringify({
      email,
      first_name: name,
      api_key: process.env.GATSBY_CONVERTKIT_PUBLIC_API_KEY,
    })

    try {
      const response = await fetch(FORM_URL, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json",
        },
      })

      const json = await response.json()

      if (json?.subscription?.id) {
        setStatus("SUCCESS")
        return
      }

      setStatus("ERROR")
      Sentry.captureMessage("Error subscribing to newsletter", {
        extra: json,
      })
    } catch (err) {
      setStatus("ERROR")
      console.log(err)
      Sentry.captureException(err)
    }
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setEmail(value)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setName(value)
  }

  return (
    <Container className="py-11 px-8">
      {status === "SUCCESS" && (
        <>
          <h2>
            Welcome aboard{name ? `, ${name}` : ""}{" "}
            <span role="img" aria-label="Ship">
              🚢
            </span>
          </h2>
          <Spacer />
          <h2> Please check your inbox to confirm the subscription!</h2>
        </>
      )}
      {status === "ERROR" && (
        <>
          <h2>Oops, something went wrong...</h2>
          <Spacer />
          <h2>
            Please,{" "}
            <TryAgain onClick={() => setStatus(null)}>try again.</TryAgain>
          </h2>
        </>
      )}
      {status === null && (
        <>
          <Intro>
            <h2>Join the newsletter!</h2>
            <p className="mt-2">
              Subscribe to get latest content by email and to become a fellow
              pineapple{" "}
              <span role="img" aria-label="Pineapple">
                🍍
              </span>
            </p>
          </Intro>

          <form onSubmit={handleSubmit}>
            <input
              className="mb-2"
              aria-label="Your first name"
              name="fields[first_name]"
              placeholder="Your first name"
              type="text"
              onChange={handleNameChange}
              value={name}
            />
            <input
              className="mb-2"
              aria-label="Your email address"
              name="email_address"
              placeholder="Your email address"
              required
              type="email"
              onChange={handleEmailChange}
              value={email}
            />
            <Submit>SUBSCRIBE</Submit>
          </form>
        </>
      )}
    </Container>
  )
}

export default SubscribeForm
