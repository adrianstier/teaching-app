# Teaching app audit repairs — October 25, 2026

SW2-03 partially repaired. PDF uploads now use the installed pdf-parse v2 PDFParse/getText API, report total pages and destroy parser resources in a finally block. Zod validation reads issues rather than the removed errors property. Sanitization tolerates a client field named hasOwnProperty.

Run npm run test:audit-repairs. Runtime checks pass against actual production modules and installed libraries: valid and invalid requests, shadowed hasOwnProperty input, real generated PDF text and page count, malformed PDF rejection, and Markdown parsing. Test fixtures are synthetic, temporary and cleaned up. No server, AI service, database or live teaching session is started.

Backend TypeScript errors reduced from 39 to 36. Remaining errors involve session artifacts, agent-output typing, a session-store import and syllabus input types. Client TypeScript still has four errors (checkpoint props, submit callbacks, example indexing). Neither full build nor end-to-end app functionality is claimed repaired. Existing loopback restriction remains; public-hosting authentication is not resolved.
