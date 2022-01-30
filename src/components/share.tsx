import React from "react"
import styled from "styled-components"
import VisuallyHidden from "./visually-hidden"
import CopyButton from "./copy-button"
import { rhythm } from "../utils/typography"

const Share = ({ slug, title }: { slug: string; title: string }) => {
  const postUrl = `https://pragmaticpineapple.com/${slug}`

  return (
    <Wrapper>
      <SocialLink
        target="_blank"
        rel="noreferrer"
        href={`https://news.ycombinator.com/submitlink?u=${postUrl}&t=${title}`}
      >
        <HackerNewsSVG
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
        >
          <path
            d="M31,31v450h450V31H31z M270.1,287.6v94.9h-28.1v-94.9L165,143.5h31.9L256,254.3l59.1-110.8H347
              C347,143.5,270.1,287.6,270.1,287.6z"
          />
        </HackerNewsSVG>
        <VisuallyHidden>
          <TextWrapper>Hacker News</TextWrapper>
        </VisuallyHidden>
      </SocialLink>
      <SocialLink
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/intent/tweet/?text=${title}&url=${postUrl}%2F&via=nikolalsvk`}
      >
        <TwitterSVG
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </TwitterSVG>
        <VisuallyHidden>
          <TextWrapper>Twitter</TextWrapper>
        </VisuallyHidden>
      </SocialLink>
      <SocialLink
        target="_blank"
        rel="noreferrer"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}`}
      >
        <LinkedInSVG
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </LinkedInSVG>
        <VisuallyHidden>
          <TextWrapper>LinkedIn</TextWrapper>
        </VisuallyHidden>
      </SocialLink>
      <SocialLink
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
      >
        <FacebookSVG
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </FacebookSVG>
        <VisuallyHidden>
          <TextWrapper>Facebook</TextWrapper>
        </VisuallyHidden>
      </SocialLink>
      <CopyButton postUrl={postUrl} />
    </Wrapper>
  )
}

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  margin-bottom: ${rhythm(1)};
`

const SVG = styled.svg`
  margin-right: 4px;
  display: block;
  fill: var(--color-text);
`

const HackerNewsSVG = styled(SVG)``

const TwitterSVG = styled(SVG)`
  transform: translate(0, 0px);
`

const LinkedInSVG = styled(SVG)`
  transform: translate(0, -2px);
`

const FacebookSVG = styled(SVG)`
  margin-left: -4px;
  margin-right: 0;
`

const SocialLink = styled.a`
  height: 24px;
  display: flex;
  justify-content: space-between;
  box-shadow: none;
  margin-right: 8px;

  &:last-of-type {
    margin-right: 10px;
  }
`

const TextWrapper = styled.span`
  display: block;
  margin-left: 2px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  color: var(--color-text);
`

export default Share
