# Melsoft TenderPilot

Melsoft TenderPilot is an MVP web app that auto-fills South African tender documents (SBD1, SBD4, SBD 6.1, POPIA) using a saved company profile. It detects fields, asks for review, and exports a completed DOCX.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Zod validation
- Local file storage in `/uploads`
- DOCX parsing: `mammoth`
- DOCX filling: `docxtemplater`
- PDF extraction: `pdf-parse`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set environment variables:

Create a `.env` file with:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tenderpilot"
```

3. Run Prisma migrations and generate the client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Workflow

1. **Company Profile**: Save reusable company details.
2. **Upload Tender Document**: Upload DOCX or PDF files.
3. **Review & Edit**: Confirm detected fields and edit values.
4. **Generate DOCX**: Download a filled DOCX output.

## API endpoints

- `POST /api/company`
- `GET /api/company`
- `PUT /api/company/:id`
- `POST /api/upload`
- `GET /api/doc/:id/fields`
- `POST /api/doc/:id/generate`
- `GET /api/doc/:id/download`

## Notes

- Low-confidence detections default to `Needs review` and must be confirmed in the review screen.
- Generated documents are stored in `/uploads/generated`.
