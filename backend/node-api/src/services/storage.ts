import { S3Client, CreateBucketCommand, HeadBucketCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || 'http://127.0.0.1:9000',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'admin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'adminpassword',
    },
    forcePathStyle: true, // Support for MinIO
});

const BUCKET_NAME = process.env.S3_BUCKET || 'viarteia-assets';

export async function initStorage() {
    try {
        await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`Storage: Connected to bucket "${BUCKET_NAME}"`);
    } catch (error: any) {
        // 404 means bucket not found
        if (error.$metadata?.httpStatusCode === 404) {
            console.log(`Storage: Bucket "${BUCKET_NAME}" not found. Creating...`);
            try {
                await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
                console.log(`Storage: Bucket "${BUCKET_NAME}" created successfully.`);
            } catch (createError) {
                console.error('Storage: Error creating bucket:', createError);
            }
        } else {
            console.error('Storage: Error connecting to S3:', error);
        }
    }
}

// Generate Upload URL (Presigned)
export async function getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
}

// Generate Read URL (Presigned)
export async function getDownloadUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export { s3, BUCKET_NAME };
