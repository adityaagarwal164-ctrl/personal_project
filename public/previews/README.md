# Open Graph Preview Images

This directory contains dynamically generated Open Graph (OG) images for social media sharing.

## About

- Images are automatically generated via the `/api/og` endpoint
- Each image is 1200x630 pixels (standard social media preview size)
- Images are cached here to avoid regeneration on every request
- Files are named using unique IDs (e.g., `blog-1.png`, `tool-slack.png`)

## How It Works

When a page is loaded, the SEO component checks if an OG image exists:
1. If cached image exists → use it immediately
2. If not cached → generate new image and save it here

## Cache Management

Generated images are cached indefinitely unless:
- The `regenerate=true` query parameter is used in the API call
- The cache is manually cleared
- The file is manually deleted

## DO NOT Commit Large Files

This directory should generally be `.gitignore`d in production, but for development purposes, you may want to commit a few example images.
