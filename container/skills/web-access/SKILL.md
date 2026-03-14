---
name: web-access
description: Access web content or interact with websites. Use when fetching URLs, reading pages, doing research, or automating browser interactions.
---

# Web Access

Three tools are available. Always start with the cheapest option that can do the job.

## Decision

**Use Fetch** (`mcp__fetch__fetch`) when:
- Reading a page, article, or document
- Fetching API responses or JSON
- The page doesn't need JavaScript to render
- You only need the content, not to interact

**Use Playwright** (`mcp__playwright__browser_navigate`, `mcp__playwright__browser_snapshot`, etc.) when:
- The page requires JavaScript to render
- You need to click, fill forms, log in, or navigate
- You need a screenshot
- Fetch returned empty or broken content

**Use agent-browser** (bash) only as a last resort:
- Playwright MCP is unavailable or broken
- You need saved auth state across sessions

## Fetch usage

```
mcp__fetch__fetch({ url: "https://example.com" })
```

Returns page content as markdown. Fast, no browser overhead.

## Playwright usage

```
mcp__playwright__browser_navigate({ url: "https://example.com" })
mcp__playwright__browser_snapshot({})          # See page content/elements
mcp__playwright__browser_click({ element: "..." })
mcp__playwright__browser_fill({ element: "...", value: "..." })
mcp__playwright__browser_take_screenshot({})
```

## Default rule

> Fetch first. Playwright only when needed. agent-browser never unless forced.
