import React from "react"
import VisuallyHidden from "./visually-hidden"
import CopyButton from "./copy-button"

const Share = ({ slug, title }: { slug: string; title: string }) => {
  const postUrl = `https://pragmaticpineapple.com${slug}`
  const socialLinkClasses =
    "h-6 flex justify-between shadow-none mr-2 last:mr-2.5 transition-transform duration-300 ease-in-out hover:translate-y-[10%] focus:translate-y-[10%] hover:duration-200 focus:duration-200"
  const svgClasses = "mr-1 block fill-[var(--color-text)]"

  return (
    <section className="flex flex-wrap items-baseline mb-6">
      <a
        id="hackernews-share-link"
        target="_blank"
        rel="noreferrer"
        href={`https://news.ycombinator.com/submitlink?u=${postUrl}&t=${title}`}
        className={socialLinkClasses}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
          className={svgClasses}
        >
          <path
            d="M31,31v450h450V31H31z M270.1,287.6v94.9h-28.1v-94.9L165,143.5h31.9L256,254.3l59.1-110.8H347
              C347,143.5,270.1,287.6,270.1,287.6z"
          />
        </svg>
        <VisuallyHidden>
          <span className="block ml-0.5 mr-1.5 flex items-center text-[var(--color-text)]">
            Hacker News
          </span>
        </VisuallyHidden>
      </a>

      <a
        id="twitter-share-link"
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/intent/tweet/?text=${title}&url=${postUrl}&via=nikolalsvk`}
        className={socialLinkClasses}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#000"
          className={`${svgClasses} translate-y-[1px]`}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
        <VisuallyHidden>
          <span className="block ml-0.5 mr-1.5 flex items-center text-[var(--color-text)]">
            Twitter
          </span>
        </VisuallyHidden>
      </a>

      <a
        id="linkedin-share-link"
        target="_blank"
        rel="noreferrer"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}`}
        className={socialLinkClasses}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className={`${svgClasses} -translate-y-[2px]`}
        >
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
        <VisuallyHidden>
          <span className="block ml-0.5 mr-1.5 flex items-center text-[var(--color-text)]">
            LinkedIn
          </span>
        </VisuallyHidden>
      </a>

      <a
        id="facebook-share-link"
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
        className={socialLinkClasses}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className={`${svgClasses} -ml-1 mr-0`}
        >
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
        <VisuallyHidden>
          <span className="block ml-0.5 mr-1.5 flex items-center text-[var(--color-text)]">
            Facebook
          </span>
        </VisuallyHidden>
      </a>

      <div className="transition-transform duration-300 ease-in-out hover:translate-y-[10%] focus:translate-y-[10%] hover:duration-200 focus:duration-200">
        <CopyButton postUrl={postUrl}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={`w-6 h-6 ${svgClasses}`}
          >
            <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
          </svg>
        </CopyButton>
      </div>
    </section>
  )
}

export default Share
