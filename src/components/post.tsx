import React from "react"
import { Link } from "gatsby"

interface Props {
  slug: string
  title: string
  date: string
  description: string
  excerpt: string
}

const Post = ({ slug, title, date, description, excerpt }: Props) => {
  return (
    <article key={slug}>
      <header>
        <h2 className="mb-1">
          <Link style={{ boxShadow: `none` }} to={slug}>
            {title}
          </Link>
        </h2>
        <small>
          <time>{date}</time>
        </small>
      </header>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: description || excerpt,
          }}
        />
      </section>
    </article>
  )
}

export default Post
