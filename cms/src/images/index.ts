import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppContext } from "..";

const createS3Client = (c: AppContext) => {
  // TODO: Cache this on the context object
  return new S3Client({
    region: "auto",
    endpoint: `https://${c.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: c.env.R2_ACCESS_KEY_ID,
      secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
    },
  });
};

export const getPresignedGetUrl = async (c: AppContext, key: string) => {
  const s3 = createS3Client(c);
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: "kennan-dev-content-bucket",
      Key: key,
    }),
    { expiresIn: 3600 },
  );
};

export const getPresignedPutUrl = async (
  c: AppContext,
  key: string,
  contentType: string,
) => {
  const s3 = createS3Client(c);
  return getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: "kennan-dev-content-bucket",
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 3600 },
  );
};
