"use client"

import type React from "react"
import { JSX } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  // Process content to identify code blocks, paragraphs, etc.
  const processedContent = processContent(content)

  return (
    <div className="blog-content prose prose-lg max-w-none dark:prose-invert">
      {processedContent.map((block, index) => renderBlock(block, index))}
    </div>
  )
}

// Content block types
type ContentBlock = {
  type: "paragraph" | "heading" | "code" | "list" | "image"
  content: string
  level?: number // For headings
  language?: string // For code blocks
}

// Process raw content into structured blocks
function processContent(content: string): ContentBlock[] {
  if (!content) return []

  // Split content by double newlines to separate paragraphs
  const blocks: ContentBlock[] = []

  // Simple regex patterns for different content types
  const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const listItemRegex = /^[*-]\s+(.+)$/gm

  // Replace code blocks with placeholders to process them separately
  let processedContent = content
  const codeBlocks: { language: string; code: string }[] = []

  let codeMatch
  while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
    const language = codeMatch[1] || "javascript"
    const code = codeMatch[2]
    codeBlocks.push({ language, code })
    processedContent = processedContent.replace(codeMatch[0], `[CODE_BLOCK_${codeBlocks.length - 1}]`)
  }

  // Process paragraphs and other elements
  const paragraphs = processedContent.split(/\n{2,}/)

  paragraphs.forEach((paragraph) => {
    paragraph = paragraph.trim()
    if (!paragraph) return

    // Check if this is a code block placeholder
    const codeBlockMatch = paragraph.match(/\[CODE_BLOCK_(\d+)\]/)
    if (codeBlockMatch) {
      const blockIndex = Number(codeBlockMatch[1])
      const { language, code } = codeBlocks[blockIndex]
      blocks.push({
        type: "code",
        content: code,
        language,
      })
      return
    }

    // Check if this is a heading
    const headingMatch = paragraph.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      blocks.push({
        type: "heading",
        content: headingMatch[2],
        level: headingMatch[1].length,
      })
      return
    }

    // Check if this is a list
    if (paragraph.match(listItemRegex)) {
      blocks.push({
        type: "list",
        content: paragraph,
      })
      return
    }

    // Default to paragraph
    blocks.push({
      type: "paragraph",
      content: paragraph,
    })
  })

  return blocks
}

// Render different types of content blocks
function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements
      return (
        <HeadingTag key={index} className="mt-6 mb-4">
          {block.content}
        </HeadingTag>
      )

    case "code":
      return (
        <div key={index} className="my-6">
          <SyntaxHighlighter language={block.language || "javascript"} style={vscDarkPlus} className="rounded-md">
            {block.content}
          </SyntaxHighlighter>
        </div>
      )

    case "list":
      return (
        <ul key={index} className="list-disc pl-6 my-4">
          {block.content.split(/\n/).map((item, i) => (
            <li key={i} className="mb-2">
              {item.replace(/^[*-]\s+/, "")}
            </li>
          ))}
        </ul>
      )

    case "paragraph":
    default:
      // Process inline code and other formatting
      const formattedContent = formatInlineElements(block.content)
      return (
        <p key={index} className="mb-4">
          {formattedContent}
        </p>
      )
  }
}

// Format inline elements like code, bold, italic
function formatInlineElements(text: string): React.ReactNode {
  // Split the text by inline code markers
  const parts = text.split(/`([^`]+)`/)

  return parts.map((part, index) => {
    // Every odd index is an inline code
    if (index % 2 === 1) {
      return (
        <code key={index} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
          {part}
        </code>
      )
    }

    // Process bold and italic in the regular text
    let formattedPart = part

    // Replace emojis with spans to ensure proper rendering
    const emojiRegex = /🚀|🌱|🔥|✨|📦|🛠️|🔍|⚡/g
    const emojis = part.match(emojiRegex)

    if (emojis) {
      emojis.forEach((emoji, i) => {
        formattedPart = formattedPart.replace(emoji, `[EMOJI_${i}]`)
      })
    }

    // Process the text for bold and italic
    const boldItalicRegex = /\*\*\*([^*]+)\*\*\*/g
    const boldRegex = /\*\*([^*]+)\*\*/g
    const italicRegex = /\*([^*]+)\*/g

    formattedPart = formattedPart
      .replace(boldItalicRegex, "<strong><em>$1</em></strong>")
      .replace(boldRegex, "<strong>$1</strong>")
      .replace(italicRegex, "<em>$1</em>")

    // Restore emojis
    if (emojis) {
      emojis.forEach((emoji, i) => {
        formattedPart = formattedPart.replace(`[EMOJI_${i}]`, emoji)
      })
    }

    // Use dangerouslySetInnerHTML for the formatted text
    return <span key={index} dangerouslySetInnerHTML={{ __html: formattedPart }} />
  })
}
