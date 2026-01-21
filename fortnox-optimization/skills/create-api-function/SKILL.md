---
description: Create a new Netlify Function for API integration
---

# Create API Function Skill

This skill helps you create a new Netlify Serverless Function for backend logic, ensuring security and proper error handling.

## Usage

Call this skill when you need to create a new backend endpoint, for example, to proxy an external API call to Fortnox or Quinyx.

## Steps

1.  **Create Function File**
    -   Location: `netlify/functions/<function-name>.ts` (or `.js` if using JS).
    -   Use `FunctionTemplate.ts` as a base.

2.  **Implement Logic**
    -   Handle HTTP methods (GET, POST, etc.).
    -   Parse request body.
    -   Implement logic (e.g., fetch external API).

3.  **Handle CORS & Errors**
    -   Ensure CORS headers are set (if called from frontend).
    -   Wrap logic in `try/catch`.
    -   Return appropriate status codes (200, 400, 500).

## Template
Use the `FunctionTemplate.ts` file in this directory as a starting point.
