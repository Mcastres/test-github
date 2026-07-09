# Forms — package surface

> For the CLI workflow (`fimo forms push`, "Add a contact form" recipe), see **`fimo-cli/references/forms.md`**.

This file covers the **package surface**: the JSON spec you write, the generated Zod schema + `submitX` helper you import, the React patterns. Version-locked to the project's `fimo` package.

## Form JSON spec

```json
{
  "name": "contact-us",
  "label": "Contact Us",
  "fields": {
    "name": { "type": "text", "label": "Full Name", "required": true },
    "email": { "type": "email", "label": "Email Address", "required": true },
    "message": {
      "type": "textarea",
      "label": "Message",
      "required": true,
      "validation": { "minLength": 10, "maxLength": 2000 }
    },
    "subject": { "type": "select", "label": "Subject", "options": ["General", "Support", "Sales"] },
    "newsletter": { "type": "checkbox", "label": "Subscribe to newsletter" }
  }
}
```

> Email notification recipients are configured from the Fimo web UI, not via the JSON.

**Required**: `name` (kebab-case, matches filename), `label`, `fields`.

## Field types

`text`, `email`, `textarea`, `number`, `phone`, `url`, `select` (requires `options`), `checkbox`, `date`, `hidden` (use `defaultValue`), `file`.

## Per-field options

- `required: boolean`
- `placeholder: string`
- `defaultValue: any`
- `options: string[]` — for `select`
- `validation`: `{ minLength, maxLength, min, max, pattern, maxFileSize, accept }`

## Generated TS client

After pre-build (or `fimo deploy`), `src/forms/{name}.ts` exists with:

```ts
export const FORM_ID = '<uuid>';
export const ContactUsSchema = z.object({
  /* fields */
});
export type ContactUsData = z.infer<typeof ContactUsSchema>;
export async function submitContactUs(data): Promise<{ success: boolean; errors?: Record<string, string> }>;
```

Re-exported by `src/forms/index.ts`.

The `submitX` helper handles fetch + file uploads (presigned URLs) automatically. Never hand-roll fetch or validation.

## React code pattern

Always import from `@/forms/{name}` — never hand-roll fetch, never hand-roll validation.

```tsx
import { useState } from 'react';
import { ContactUsSchema, submitContactUs } from '@/forms/contact-us';
import type { ContactUsData } from '@/forms/contact-us';

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = ContactUsSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    const result = await submitContactUs(parsed.data);
    setLoading(false);
    if (!result.success && result.errors) setErrors(result.errors);
  };

  // render native inputs or the project's form primitives...
}
```

**File fields**: pass the raw `File` from `<input type="file">` to `submitX` — it handles the presigned upload automatically. **Never base64-encode.**

## Labels and copy

Wrap every visible string in `t('key')` and create the DB value with `fimo labels set` — see `references/labels.md`. This includes form labels, placeholders, button text, success/error messages.

## Forms vs. schemas

Forms = **end-user input** (contact, signup, feedback). Schemas = **editor-managed content** (blog posts, products). See `references/content.md` for schemas.
