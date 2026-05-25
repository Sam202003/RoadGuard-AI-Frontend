# src/uploads — File Upload System

Wraps file selection, validation, preprocessing, and the transport mechanism to object storage.

| Folder | Purpose |
|--------|---------|
| `adapters/` | Upload mechanism — S3 presigned URLs, GCS, direct upload, multipart |
| `validators/` | Size / type / dimension / virus-scan trigger validators |
| `processors/` | Pre-upload processing — image compression, EXIF stripping, HEIC→JPEG |
| `presigned/` | Presigned URL acquisition + retry |

## Pattern

```
File picked
   ↓
validators run (size, type, …) ─── reject early on client
   ↓
processors run (compress, strip EXIF)
   ↓
presigned URL fetched from BFF
   ↓
adapter uploads with progress events
   ↓
on success: metadata POSTed to backend
   ↓
Redux slice updated with file reference
```

## Where this is used

- Breakdown request photos
- Vehicle insurance / RC documents
- Provider KYC documents
- Profile picture
- Chat attachments
- AI vision analysis (vehicle damage)
