import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { uuidv7 } from "uuidv7";

// Slide images are the only upload surface at parity (#13). Legacy accepted any mimetype;
// images-only is the parity intent. webp is a free modern add.
export const ALLOWED_SLIDE_MIME = ["image/png", "image/jpeg", "image/gif", "image/webp"] as const;
export type SlideMime = (typeof ALLOWED_SLIDE_MIME)[number];

// Legacy multer cap.
export const MAX_SLIDE_BYTES = 10 * 1024 * 1024; // 10 MB

const EXT_BY_MIME: Record<SlideMime, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

const UPLOAD_URL_TTL = 60 * 5; // 5 min to complete a PUT
const VIEW_URL_TTL = 60 * 60 * 8; // 8h — comfortably outlives a live session (#13)

export function isAllowedSlideMime(mime: string): mime is SlideMime {
  return (ALLOWED_SLIDE_MIME as readonly string[]).includes(mime);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

// Lazy singleton — same rationale as @classroom/db: importing this during a build must not
// require the S3 env to be present.
let client: S3Client | undefined;
function s3(): S3Client {
  if (!client) {
    client = new S3Client({
      region: process.env.S3_REGION ?? "us-east-1",
      endpoint: requireEnv("S3_ENDPOINT"),
      // MinIO and most S3-compatibles require path-style addressing.
      forcePathStyle: (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true",
      credentials: {
        accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
      },
    });
  }
  return client;
}

function bucket(): string {
  return requireEnv("S3_BUCKET");
}

// Flat key layout — a slide can be uploaded before its lesson row exists (the lesson create
// flow), so the key can't nest under a lessonId.
export function buildSlideKey(mime: SlideMime): string {
  return `slides/${uuidv7()}.${EXT_BY_MIME[mime]}`;
}

// Presigned PUT the browser uploads directly to — file bytes never transit the app server.
// NB: presigned PUT can't enforce a max object size (that needs a POST policy); the size cap
// is validated at mint time against the client-declared size and re-checked client-side.
export async function createSlideUploadUrl(
  mime: SlideMime,
): Promise<{ key: string; uploadUrl: string }> {
  const key = buildSlideKey(mime);
  const uploadUrl = await getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: mime }),
    { expiresIn: UPLOAD_URL_TTL },
  );
  return { key, uploadUrl };
}

// Presigned GET minted per read (#13) — never persisted; the DB stores only the object key.
export async function getSlideViewUrl(key: string): Promise<string> {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: bucket(), Key: key }), {
    expiresIn: VIEW_URL_TTL,
  });
}

export async function deleteSlideObject(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
