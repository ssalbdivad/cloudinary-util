import { z } from "zod";
import { defaultImageProps } from "../plugins/default-image.js";
import { enhanceProps } from "../plugins/enhance.js";
import { extractProps } from "../plugins/extract.js";
import { fillBackgroundProps } from "../plugins/fill-background.js";
import { recolorProps } from "../plugins/recolor.js";
import { removeProps } from "../plugins/remove.js";
import { replaceBackgroundProps } from "../plugins/replace-background.js";
import { replaceProps } from "../plugins/replace.js";
import { restoreProps } from "../plugins/restore.js";
import { zoompanProps } from "../plugins/zoompan.js";
import { assetOptionsSchema } from "./asset.js";

export const imageOptionsSchema = assetOptionsSchema.merge(
  z.object({
    // Spreading plugins instead of extend or merge to avoid excessive schema warning
    // https://github.com/microsoft/TypeScript/issues/34933#issuecomment-1772787785
    ...defaultImageProps,
    ...enhanceProps,
    ...extractProps,
    ...fillBackgroundProps,
    ...recolorProps,
    ...removeProps,
    ...replaceProps,
    ...replaceBackgroundProps,
    ...restoreProps,
    ...zoompanProps,
  })
);

type _ImageOptions = z.infer<typeof imageOptionsSchema>;

export interface ImageOptions extends _ImageOptions {}
