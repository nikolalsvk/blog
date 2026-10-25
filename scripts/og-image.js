#!/usr/bin/env node

// Builds a 1200x630 social image from a post cover: the photo, cropped,
// with the title and pragmaticpineapple.com plus a pineapple. Type matches
// the Photoshop template: Josefin Sans Bold, with the Apple pineapple emoji.

const fs = require("fs")
const os = require("os")
const path = require("path")
const { execFileSync } = require("child_process")
const opentype = require("opentype.js")
const sharp = require("sharp")

const WIDTH = 1200
const HEIGHT = 630
// Positions and sizes come from ~/Pictures/cover.psd. The document is 72 ppi
// and the text layers are scaled by 0.20094, so the point sizes land at
// 65px for that template's four-line title and 55px for the URL and emoji.
const TITLE_X = 93
const DOMAIN_X = 90
const TITLE_CAP_TOP = 97
const TITLE_SIZE_MAX = 110
const TITLE_SIZE_MIN = 60
const TITLE_LINE_HEIGHT = 1.2
const TITLE_MAX_WIDTH = WIDTH - TITLE_X - 48
const MAX_TITLE_LINES = 4
const TITLE_DOMAIN_GAP = 28
// Shorter titles stay large. A four-line title can shrink to the template's 65px.
const LINE_FLOORS = [110, 84, 72, 64]
const DOMAIN = "pragmaticpineapple.com"
const DOMAIN_SIZE = 55
const DOMAIN_BASELINE = 513

const ROOT = path.join(__dirname, "..")
const FONT_PATH = path.join(__dirname, "assets", "JosefinSans-Bold.woff")
const PINEAPPLE_PATH = path.join(__dirname, "assets", "pineapple.svg")
const EMOJI_SOURCE = path.join(__dirname, "render-emoji.swift")
const EMOJI_BINARY = path.join(os.tmpdir(), "pragmatic-pineapple-og-emoji")

function printHelp() {
  console.log(`Generate a 1200x630 social image from a post cover.

Usage:
  npm run og-image -- <slug-or-directory> [more...]
  npm run og-image -- my-post --font-size 72
  npm run og-image -- my-post --dim 45
  npm run og-image -- --cover cover.jpg --title "Post title" --out og-image.jpg

The cover is center-cropped to 1200x630. The title is Josefin Sans Bold,
sized down when it needs more lines. pragmaticpineapple.com and the Apple
pineapple sit at the bottom left, both at 55px, as in the Photoshop template.
When the output stays inside the post directory, blogOgImage is set in
index.md.

Options:
  --title <text>     Title to draw. Defaults to the post title.
  --font-size <px>   Lock the title size. Without this, the size is chosen
                     between 60 and 110 to fit the title.
  --dim <0-100>      Pull down bright areas so white text stays readable.
                     0 leaves the photo alone. Try 40 on a bright cover.
  --cover <file>     Cover image. Defaults to the post coverImage.
  --out <file>       Output path. Defaults to <post>/og-image.jpg.
  --no-frontmatter   Do not write blogOgImage into index.md.
  --help             Show this help.
`)
}

function parseArgs(argv) {
  const options = {
    posts: [],
    title: null,
    fontSize: null,
    dim: null,
    cover: null,
    out: null,
    frontmatter: true,
    help: false,
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--help" || arg === "-h") {
      options.help = true
    } else if (arg === "--title") {
      options.title = readOption(argv, ++i, "--title")
    } else if (arg === "--font-size") {
      options.fontSize = readSize(argv, ++i, "--font-size")
    } else if (arg === "--dim") {
      options.dim = readPercent(argv, ++i, "--dim")
    } else if (arg === "--cover") {
      options.cover = readOption(argv, ++i, "--cover")
    } else if (arg === "--out") {
      options.out = readOption(argv, ++i, "--out")
    } else if (arg === "--no-frontmatter") {
      options.frontmatter = false
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`)
    } else {
      options.posts.push(arg)
    }
  }

  return options
}

function readOption(argv, index, flag) {
  const value = argv[index]
  if (!value || value.startsWith("-")) {
    throw new Error(`${flag} needs a value`)
  }
  return value
}

function readSize(argv, index, flag) {
  const value = readOption(argv, index, flag)
  const size = Number(value)
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error(`${flag} needs a size in pixels, like 72`)
  }
  return size
}

function readPercent(argv, index, flag) {
  const value = readOption(argv, index, flag)
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0 || amount > 100) {
    throw new Error(`${flag} needs a number from 0 to 100`)
  }
  return amount
}

function smoothstep(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// Bright covers swallow white type. This leaves shadows close to where they
// are and pulls the highlights down, which is the part that clashes with
// the title.
async function toneDown(image, amount) {
  if (!amount) return image

  const strength = amount / 100
  const { data, info } = await sharp(image)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const pixels = Buffer.from(data)

  for (let i = 0; i < pixels.length; i += info.channels) {
    const red = pixels[i]
    const green = pixels[i + 1]
    const blue = pixels[i + 2]
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
    const highlight = smoothstep(0.4, 1, luminance)
    const factor = 1 - strength * (0.12 + 0.55 * highlight)
    pixels[i] = Math.round(red * factor)
    pixels[i + 1] = Math.round(green * factor)
    pixels[i + 2] = Math.round(blue * factor)
  }

  return sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .removeAlpha()
    .png()
    .toBuffer()
}

function resolvePost(input) {
  const candidates = [
    path.resolve(input),
    path.resolve(ROOT, input),
    path.resolve(ROOT, "content/blog", input),
  ]

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue
    const stat = fs.statSync(candidate)
    if (stat.isDirectory()) {
      const index = path.join(candidate, "index.md")
      if (fs.existsSync(index)) return { dir: candidate, index }
    } else if (candidate.endsWith(".md")) {
      return { dir: path.dirname(candidate), index: candidate }
    }
  }

  return null
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const fields = {}
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!field) continue
    let value = field[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    fields[field[1]] = value
  }
  return fields
}

function updateFrontmatter(markdown, ogValue) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { markdown, status: "missing" }

  const newline = match[0].includes("\r\n") ? "\r\n" : "\n"
  let frontmatter = match[1]
  const line = `blogOgImage: ${ogValue}`

  if (/^blogOgImage:\s*/m.test(frontmatter)) {
    const current = frontmatter.match(/^blogOgImage:\s*(.*)$/m)[1].trim()
    if (current === ogValue) return { markdown, status: "unchanged" }
    frontmatter = frontmatter.replace(/^blogOgImage:\s*.*$/m, line)
  } else if (/^coverImage:\s*.*$/m.test(frontmatter)) {
    frontmatter = frontmatter.replace(
      /^(coverImage:\s*.*)$/m,
      `$1${newline}${line}`
    )
  } else {
    frontmatter = `${frontmatter}${newline}${line}`
  }

  const next = `---${newline}${frontmatter}${newline}---`
  return {
    markdown: markdown.replace(match[0], next),
    status: /^blogOgImage:\s*/m.test(match[1]) ? "updated" : "added",
  }
}

function fontMetrics(font, fontSize) {
  const units = font.unitsPerEm
  const os2 = font.tables.os2 || {}
  return {
    cap: ((os2.sCapHeight || 700) / units) * fontSize,
    descender: (Math.abs(font.descender) / units) * fontSize,
  }
}

function titleWords(title) {
  const raw = title.split(/\s+/).filter(Boolean)
  const words = []
  for (const word of raw) {
    if (words.length && /^[-–—|/]$/.test(word)) {
      words[words.length - 1] += ` ${word}`
    } else {
      words.push(word)
    }
  }
  return words
}

function splitsOf(words, lineCount) {
  if (lineCount === 1) return [[words.join(" ")]]
  if (words.length < lineCount) return []

  const results = []
  const chosen = []

  function visit(start, remaining) {
    if (remaining === 1) {
      results.push(chosen.concat(words.slice(start).join(" ")))
      return
    }

    for (let end = start + 1; end <= words.length - (remaining - 1); end++) {
      chosen.push(words.slice(start, end).join(" "))
      visit(end, remaining - 1)
      chosen.pop()
    }
  }

  visit(0, lineCount)
  return results
}

const LEADING_SHORT_WORD = /^(so|and|or|but)$/i

function leadingShortWords(lines) {
  let count = 0
  for (let index = 1; index < lines.length; index++) {
    const first = lines[index].split(" ")[0].replace(/[.,:;!?]+$/g, "")
    if (LEADING_SHORT_WORD.test(first)) count += 1
  }
  return count
}

function bestSplit(font, words, fontSize, lineCount, allowOverflow) {
  let best = null

  for (const lines of splitsOf(words, lineCount)) {
    const widths = lines.map((line) => font.getAdvanceWidth(line, fontSize))
    const widest = Math.max(...widths)
    if (!allowOverflow && widest > TITLE_MAX_WIDTH) continue

    // Opening a line with "so" or "and" reads worse than a slightly
    // less even break. Prepositions are left alone.
    const score = widest + leadingShortWords(lines) * 80
    const ragged = widest - Math.min(...widths)
    if (
      !best ||
      score < best.score - 1 ||
      (Math.abs(score - best.score) <= 1 && ragged < best.ragged)
    ) {
      best = { lines, widest, score, ragged }
    }
  }

  return best
}

function titleCollides(font, fontSize, lineCount) {
  const { cap } = fontMetrics(font, fontSize)
  const blockBottom =
    TITLE_CAP_TOP + cap + (lineCount - 1) * fontSize * TITLE_LINE_HEIGHT
  const domainTop = DOMAIN_BASELINE - fontMetrics(font, DOMAIN_SIZE).cap
  return blockBottom + TITLE_DOMAIN_GAP > domainTop
}

function layoutTitle(font, title, fixedSize) {
  const words = titleWords(title)

  if (fixedSize) {
    const lineLimit = Math.min(MAX_TITLE_LINES, words.length)
    for (let lineCount = 1; lineCount <= lineLimit; lineCount++) {
      const split = bestSplit(font, words, fixedSize, lineCount)
      if (!split) continue
      return { fontSize: fixedSize, lines: split.lines }
    }

    const split = bestSplit(font, words, fixedSize, lineLimit, true)
    return {
      fontSize: fixedSize,
      lines: split ? split.lines : [words.join(" ")],
    }
  }

  for (let lineCount = 1; lineCount <= MAX_TITLE_LINES; lineCount++) {
    const floor = LINE_FLOORS[lineCount - 1]
    for (let fontSize = TITLE_SIZE_MAX; fontSize >= floor; fontSize -= 2) {
      const split = bestSplit(font, words, fontSize, lineCount)
      if (!split) continue
      if (titleCollides(font, fontSize, split.lines.length)) continue
      return { fontSize, lines: split.lines }
    }
  }

  return { fontSize: TITLE_SIZE_MIN, lines: [words.join(" ")] }
}

function missingGlyphs(font, text) {
  const missing = []
  for (const char of text) {
    if (char.trim() === "") continue
    const glyph = font.charToGlyph(char)
    if (!glyph || glyph.name === ".notdef") missing.push(char)
  }
  return missing
}

function roundCoord(value) {
  return (Math.round(value * 100) / 100).toString()
}

// opentype.js 2's toPathData() can emit NaN for tiny fractions, which
// makes the SVG renderer drop the rest of the line.
function pathData(path) {
  return path.commands
    .map((cmd) => {
      if (cmd.type === "M") return `M${roundCoord(cmd.x)} ${roundCoord(cmd.y)}`
      if (cmd.type === "L") return `L${roundCoord(cmd.x)} ${roundCoord(cmd.y)}`
      if (cmd.type === "Q") {
        return `Q${roundCoord(cmd.x1)} ${roundCoord(cmd.y1)} ${roundCoord(
          cmd.x
        )} ${roundCoord(cmd.y)}`
      }
      if (cmd.type === "C") {
        return `C${roundCoord(cmd.x1)} ${roundCoord(cmd.y1)} ${roundCoord(
          cmd.x2
        )} ${roundCoord(cmd.y2)} ${roundCoord(cmd.x)} ${roundCoord(cmd.y)}`
      }
      if (cmd.type === "Z") return "Z"
      return ""
    })
    .join("")
}

function textPath(font, lines, fontSize, firstBaseline) {
  const lineHeight = fontSize * TITLE_LINE_HEIGHT
  return lines
    .map((line, index) => {
      const baseline = firstBaseline + index * lineHeight
      return pathData(font.getPath(line, TITLE_X, baseline, fontSize))
    })
    .join("")
}

function loadFont() {
  return opentype.parse(fs.readFileSync(FONT_PATH))
}

function emojiRenderer() {
  if (fs.existsSync(EMOJI_BINARY)) return EMOJI_BINARY
  execFileSync("swiftc", ["-O", "-o", EMOJI_BINARY, EMOJI_SOURCE], {
    stdio: ["ignore", "ignore", "pipe"],
  })
  return EMOJI_BINARY
}

async function loadEmoji(fontSize) {
  if (process.platform === "darwin") {
    try {
      const png = path.join(
        os.tmpdir(),
        `pragmatic-pineapple-og-emoji-${fontSize}.png`
      )
      const output = execFileSync(emojiRenderer(), [String(fontSize), png], {
        encoding: "utf8",
      })
      const [width, ascent, descent] = output.trim().split(/\s+/).map(Number)
      const buffer = fs.readFileSync(png)
      const { data } = await sharp(buffer).ensureAlpha().raw().toBuffer({
        resolveWithObject: true,
      })
      let colored = 0
      for (let i = 0; i < data.length; i += 4) {
        if (
          data[i] > 180 &&
          data[i + 1] > 120 &&
          data[i + 2] < 140 &&
          data[i + 3] > 20
        ) {
          colored += 1
        }
      }
      if (colored > 20 && width > 0 && ascent > 0) {
        return { buffer, ascent, descent }
      }
    } catch (error) {
      console.warn(
        "Apple Color Emoji was not available, using a fallback pineapple."
      )
    }
  }

  const buffer = await sharp(PINEAPPLE_PATH)
    .resize(fontSize, fontSize)
    .png()
    .toBuffer()
  return { buffer, ascent: fontSize * 0.82, descent: fontSize * 0.18 }
}

async function renderOgImage({
  coverPath,
  title,
  outPath,
  font,
  fontSize: fixedSize,
  dim,
}) {
  const missing = missingGlyphs(font, `${title} ${DOMAIN}`)
  if (missing.length) {
    console.warn(
      `Missing glyphs for: ${[...new Set(missing)].join(
        " "
      )}. Those characters will be skipped.`
    )
  }

  const { fontSize, lines } = layoutTitle(font, title, fixedSize)
  if (fixedSize && titleCollides(font, fontSize, lines.length)) {
    console.warn(
      `Title at ${fontSize}px runs into the site link. Try a smaller --font-size.`
    )
  }
  const overflowing = lines.some(
    (line) => font.getAdvanceWidth(line, fontSize) > TITLE_MAX_WIDTH
  )
  if (overflowing) {
    console.warn(
      `Title at ${fontSize}px is wider than the image. Try a smaller --font-size.`
    )
  }
  const { cap } = fontMetrics(font, fontSize)
  const titleBaseline = TITLE_CAP_TOP + cap
  const domainY = DOMAIN_BASELINE

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <path fill="#ffffff" d="${textPath(font, lines, fontSize, titleBaseline)}"/>
  <path fill="#ffffff" d="${pathData(
    font.getPath(DOMAIN, DOMAIN_X, domainY, DOMAIN_SIZE)
  )}"/>
</svg>`

  const text = await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .png()
    .toBuffer()

  const domainWidth = font.getAdvanceWidth(DOMAIN, DOMAIN_SIZE)
  const emoji = await loadEmoji(DOMAIN_SIZE)
  // The template sets the emoji in the same run size as the URL, with no
  // space between ".com" and the pineapple.
  const emojiLeft = Math.round(DOMAIN_X + domainWidth)
  const emojiTop = Math.round(domainY - emoji.ascent)

  const cropped = await sharp(coverPath)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .toBuffer()
  const background = await toneDown(cropped, dim)

  const image = sharp(background).composite([
    { input: text, top: 0, left: 0 },
    { input: emoji.buffer, top: emojiTop, left: emojiLeft },
  ])

  if (outPath.toLowerCase().endsWith(".png")) {
    await image.png().toFile(outPath)
  } else {
    await image.jpeg({ quality: 90 }).toFile(outPath)
  }

  return { fontSize, lines, emojiLeft, emojiTop }
}

function ogFieldFor(postDir, outPath) {
  const relative = path.relative(postDir, outPath)
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null
  return `./${relative.split(path.sep).join("/")}`
}

async function generateForPost(input, options) {
  const post = resolvePost(input)
  if (!post) {
    throw new Error(`Could not find a post at ${input}`)
  }

  const markdown = fs.readFileSync(post.index, "utf8")
  const frontmatter = parseFrontmatter(markdown)
  const title = options.title || frontmatter.title
  if (!title) {
    throw new Error(
      `No title in ${path.relative(ROOT, post.index)}. Pass --title.`
    )
  }

  const coverField = options.cover || frontmatter.coverImage
  if (!coverField) {
    throw new Error(
      `No coverImage in ${path.relative(ROOT, post.index)}. Pass --cover.`
    )
  }

  const coverPath = options.cover
    ? path.resolve(options.cover)
    : path.resolve(post.dir, coverField)
  if (!fs.existsSync(coverPath)) {
    throw new Error(`Cover image not found: ${coverPath}`)
  }

  const outPath = options.out
    ? path.resolve(options.out)
    : path.join(post.dir, "og-image.jpg")

  const layout = await renderOgImage({
    coverPath,
    title,
    outPath,
    font: options.font,
    fontSize: options.fontSize,
    dim: options.dim,
  })
  const relativeOut = path.relative(ROOT, outPath)

  console.log(title)
  for (const line of layout.lines) console.log(`  ${line}`)
  console.log(`  ${layout.fontSize}px`)
  if (options.dim) console.log(`  dim ${options.dim}%`)
  console.log(`wrote ${relativeOut}`)

  if (!options.frontmatter) return

  const ogValue = ogFieldFor(post.dir, outPath)
  if (!ogValue) {
    console.log(
      "left index.md unchanged (output is outside the post directory)"
    )
    return
  }

  const updated = updateFrontmatter(markdown, ogValue)
  if (updated.status === "unchanged") {
    console.log(`blogOgImage already ${ogValue}`)
    return
  }
  if (updated.status === "missing") {
    console.log("left index.md unchanged (no frontmatter)")
    return
  }

  fs.writeFileSync(post.index, updated.markdown)
  console.log(`${updated.status} blogOgImage: ${ogValue}`)
}

async function generateOneOff(options) {
  if (!options.cover || !options.title || !options.out) {
    throw new Error(
      "Pass a post slug, or all of --cover, --title, and --out.\nRun with --help for usage."
    )
  }

  const coverPath = path.resolve(options.cover)
  if (!fs.existsSync(coverPath)) {
    throw new Error(`Cover image not found: ${coverPath}`)
  }

  const outPath = path.resolve(options.out)
  const layout = await renderOgImage({
    coverPath,
    title: options.title,
    outPath,
    font: options.font,
    fontSize: options.fontSize,
    dim: options.dim,
  })

  console.log(options.title)
  for (const line of layout.lines) console.log(`  ${line}`)
  console.log(`  ${layout.fontSize}px`)
  if (options.dim) console.log(`  dim ${options.dim}%`)
  console.log(`wrote ${path.relative(ROOT, outPath)}`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  if (
    options.posts.length > 1 &&
    (options.out || options.title || options.cover)
  ) {
    throw new Error("--title, --cover, and --out apply to a single post")
  }

  options.font = loadFont()

  if (!options.posts.length) {
    await generateOneOff(options)
    return
  }

  let failed = 0
  for (const input of options.posts) {
    try {
      await generateForPost(input, options)
    } catch (error) {
      console.error(error.message)
      failed += 1
    }
  }

  if (failed) process.exitCode = 1
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
