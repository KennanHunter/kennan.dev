import { AppContext } from "../../..";
import { getPresignedGetUrl, getPresignedPutUrl } from "../../../images";

export const get_image = async (c: AppContext) => {
  const id = c.req.param("id");
  const url = await getPresignedGetUrl(c, `p-${id}`);
  return c.json({ url });
};

export const put_photo_version = async (c: AppContext) => {
  const id = c.req.param("id");
  const photo_id = c.req.param("photo_id");

  const contentType =
    c.req.header("Content-Type") || "application/octet-stream";

  const url = await getPresignedPutUrl(c, `p-${id}`, contentType);
  return c.json({ url });
};
