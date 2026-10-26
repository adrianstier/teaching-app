import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateBody, CheckpointApprovalSchema, sanitizeInput } from '../src/middleware/validation';
import { DocumentParser } from '../src/services/document-parser';

async function main() {
  let status = 0, body: any, called = false;
  const res: any = { status(n: number) { status = n; return this; }, json(v: any) { body = v; return this; } };
  await validateBody(CheckpointApprovalSchema)({ body: { approved: 'yes' } } as any, res, () => { called = true; });
  assert.equal(status, 400); assert.equal(called, false); assert.equal(body.details[0].field, 'approved');
  await validateBody(CheckpointApprovalSchema)({ body: { approved: true } } as any, res, () => { called = true; });
  assert.equal(called, true);
  assert.deepEqual(sanitizeInput({ hasOwnProperty: 'user value', feedback: 'Hello' }), { hasOwnProperty: 'user value', feedback: 'Hello' });
  const dir = await mkdtemp(join(tmpdir(), 'teaching-parser-test-'));
  try {
    // Minimal real PDF with exact byte offsets; no external fixtures or network.
    const stream = 'BT /F1 12 Tf 50 700 Td (Hello coral science) Tj ET';
    const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
    let pdf = '%PDF-1.4\n'; const offsets = [0];
    objects.forEach((o, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i+1} 0 obj\n${o}\nendobj\n`; });
    const xref = Buffer.byteLength(pdf);
    pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(o => `${String(o).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const path = join(dir, 'fixture.pdf'); await writeFile(path, pdf);
    const parser = new DocumentParser();
    const result = await parser.parseFile(path);
    assert.match(result.text, /Hello coral science/); assert.equal(result.metadata.pageCount, 1);
    const bad = join(dir, 'invalid.pdf'); await writeFile(bad, 'not a PDF');
    await assert.rejects(parser.parseFile(bad));
    const text = join(dir, 'notes.md'); await writeFile(text, '# Coral\nRecovery');
    assert.equal((await parser.parseFile(text)).slides?.[0].title, 'Coral');
    console.log('PASS: invalid/valid requests, shadowed property, actual PDF text/pages, invalid PDF rejection, Markdown parsing');
  } finally { await rm(dir, { recursive: true, force: true }); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
