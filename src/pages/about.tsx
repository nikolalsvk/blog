import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ViewCounter from "../components/view-counter"
import Spacer from "../components/spacer"
import SubscribeForm from "../components/subscribe-form"

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
      }
    }
  }
}

const AboutPage = ({ data }: Props) => {
  const siteTitle = data.site.siteMetadata.title
  const siteUrl = data.site.siteMetadata.siteUrl

  return (
    <Layout title={siteTitle}>
      <SEO title="About" canonical={`${siteUrl}/about`} />
      <ViewCounter hideText slug="/about" />
      <h1>About Nikola</h1>
      <p>
        Hi{" "}
        <span role="img" aria-label="Wave">
          👋
        </span>
        . I am Nikola and I run the <Link to="/">Pragmatic Pineapple</Link> tech
        blog you are currently reading. My goal is to educate, teach and
        question the status quo of{" "}
        <Link to="/tags/java-script">JavaScript</Link> &{" "}
        <Link to="/tags/ruby">Ruby</Link>.
      </p>

      <p>
        How? I break down complicated and overlooked JS & Ruby problems into
        actionable take-aways for beginners and advanced coders. That includes
        multiple perspectives which encourage my readers to reflect, evaluate
        and choose a solution that fits. All that explained in simple words to
        make both languages easy to apply.
      </p>

      <p>
        My articles have appeared on the first page of{" "}
        <ExternalLink href="https://news.ycombinator.com/submitted?id=nikolalsvk">
          HackerNews
        </ExternalLink>
        , and blogs like{" "}
        <ExternalLink href="https://blog.logrocket.com/author/nikola-duza/">
          LogRocket
        </ExternalLink>
        ,{" "}
        <ExternalLink href="https://blog.appsignal.com/">
          AppSignal
        </ExternalLink>
        , and{" "}
        <ExternalLink href="https://semaphoreci.com/author/nikola">
          Semaphore
        </ExternalLink>
        . I've also been featured on newsletters like{" "}
        <ExternalLink href="https://rubyweekly.com/">Ruby Weekly</ExternalLink>,{" "}
        <ExternalLink href="https://javascriptweekly.com/">
          JavaScript Weekly
        </ExternalLink>
        , and{" "}
        <ExternalLink href="https://nodeweekly.com/">Node Weekly</ExternalLink>.
        I republish my posts on{" "}
        <ExternalLink href="https://dev.to/nikolalsvk">dev.to</ExternalLink> and{" "}
        <ExternalLink href="https://medium.com/@nikolalsvk">
          Medium
        </ExternalLink>
        , so you can follow me there if you use those platforms.
      </p>

      <h2>🛠 What I use</h2>

      <p>
        You can check out the equipment and tools I use on a day-to-day basis.
        Note that some links to these tools/products are affiliate links. By
        clicking any of them, you are supporting and helping me in a way.
      </p>

      <ul>
        <li>
          Hardware:
          <ul>
            <li>
              <ExternalLink href="https://amzn.to/35SGBx1">
                Rode NT-USB Mini
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://amzn.to/35SGBx1">
                Audio-Technica ATH-M50X
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://amzn.to/3tHDtx0">
                Nikon Z fc w/NIKKOR Z DX 16-50mm f/3.5-6.3 VR
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://amzn.to/3CEG7X3">
                Logitech POP Keys Mechanical Wireless Keyboard
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://amzn.to/3NkHTlg">
                Logitech MX Master 2S
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://amzn.to/34GWhTy">
                Dell UltraSharp U2720Q 27 Inch 4K UHD
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://amzn.to/383KkbP">
                PowerCube 4 Outlet - Socket multiplier
              </ExternalLink>
            </li>
          </ul>
        </li>
        <li>
          Software:
          <ul>
            <li>
              <ExternalLink href="https://www.vim.org/">Vim</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://iterm2.com/">iTerm2</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.zsh.org/">zsh</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://ohmyz.sh/">oh-my-zsh</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://fig.io/">fig</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://brave.com/">
                Brave Browser
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.postman.com/">
                Postman
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://calendly.com/nikolalsvk">
                Calendly
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://convertkit.com?lmref=EVgZiQ">
                ConvertKit
              </ExternalLink>
            </li>
          </ul>
        </li>
      </ul>

      <h2>🎙 Podcasts I appeared in</h2>
      <p>
        I got invited to a couple of podcasts. Here's where you can listen to me
        jabber about things:
      </p>

      <ul>
        <li>
          <ExternalLink href="https://www.youtube.com/watch?v=IS5MeOj4Hc8">
            Podkast IT Tipa 7: Ruby (gost: Nikola Đuza) - in Serbian language -
            March 18th, 2022
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://rubyrogues.com/518">
            Rode NT-USB Mini Why Write Rails View Tests with Nikola Đuza - RUBY
            496 - May 5th, 2021
          </ExternalLink>
        </li>
      </ul>

      <h2>🗣 My talks</h2>

      <p>
        I've given a couple of talks throughout my career. Unfortunately, not
        all of them got recorded. You can see the slides I have at{" "}
        <ExternalLink href="https://slides.com/nikolalsvk">
          slides.com here
        </ExternalLink>{" "}
        for all of them. Here's the full list of talks I've given:
      </p>

      <ul>
        <li>
          Effective End-to-End and Integration Testing with Cypress - Telenor IT
          Dev Talks 2020
        </li>
        <li>
          <ExternalLink href="https://www.youtube.com/watch?v=FVgp0VrNo2w">
            How Did Vim Become So Popular - VimConf 2020
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.youtube.com/watch?v=_lCSSaurjYQ">
            Speeding up Initial Rendering of Rails Pages with render_async -
            Ruby Russia 2019
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.youtube.com/watch?v=Lc4ArfGpdC8">
            Cypress Tales: Effective E2E Testing - Armada JS 2019
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.youtube.com/watch?v=I3WJhutZovw">
            There and Back Again: e2e Testing React with Cypress - GrowIT 2018
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.youtube.com/watch?v=Sjuh2VpZ_s4">
            Kako Optimizovati React Aplikaciju (How to optimize a React app) -
            NS JS Meeetup #1 (2018)
          </ExternalLink>
        </li>
        <li>Docker Images - Docker Meetup Novi Sad (2017)</li>
        <li>
          AWS Elastic Beanstalk and Semaphore CI - AWS User Group Serbia (2015)
        </li>
        <li>
          Test-Driven Ruby{" "}
          <ExternalLink href="http://renderedtext.com/ctrlflow/">
            CTRL + FLOW
          </ExternalLink>{" "}
          (2015)
        </li>
      </ul>

      <h2>🤝 Let's connect</h2>
      <p>
        Thanks for visiting this page. If you want to connect further, feel free
        to reach out on{" "}
        <ExternalLink href="https://twitter.com/nikolalsvk">
          Twitter
        </ExternalLink>{" "}
        or just{" "}
        <a href="mailto:nikola@pragmaticpineapple.com">send me an email</a>.
      </p>

      <SubscribeForm />

      <Spacer />
    </Layout>
  )
}

const ExternalLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactChild
}) => (
  <a target="_blank" rel="noopener noreferrer" href={href}>
    {children}
  </a>
)

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`
