import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_TEXT_OPTIONS,
  OverlaysPlugin,
} from "../../src/plugins/overlays.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Image Overlays", () => {
    it("should add a remote image overlay configured by overlay object", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            url: "https://user-images.githubusercontent.com/1045274/199872380-ced2b84d-fce4-4fc9-9e76-48cb4a7fb35f.png",
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_fetch:aHR0cHM6Ly91c2VyLWltYWdlcy5naXRodWJ1c2VyY29udGVudC5jb20vMTA0NTI3NC8xOTk4NzIzODAtY2VkMmI4NGQtZmNlNC00ZmM5LTllNzYtNDhjYjRhN2ZiMzVmLnBuZw%3D%3D`,
      );
    });

    it("should apply effects to an overlay by public ID", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const publicId = "images/my-cool-image";

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            publicId,
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_${publicId.replace(/\//g, ":")}/fl_layer_apply,fl_no_overflow`,
      );
    });

    it("should apply effects to an overlay", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const publicId = "images/my-cool-image";
      const width = 100;
      const height = 200;
      const shear = "40:0";
      const opacity = "50";

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            publicId,
            effects: [
              {
                width,
                height,
              },
              {
                shear,
                opacity,
              },
            ],
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_${publicId.replace(/\//g, ":")},w_${width},h_${height},e_shear:${shear},o_${opacity}/fl_layer_apply,fl_no_overflow`,
      );
    });

    it("should apply applied effects to an overlay", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const publicId = "images/my-cool-image";
      const width = 100;
      const height = 200;

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            publicId,
            effects: [
              {
                width,
                height,
              },
            ],
            appliedEffects: [
              {
                screen: true,
              },
            ],
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_${publicId.replace(/\//g, ":")},w_${width},h_${height}/fl_layer_apply,fl_no_overflow,e_screen`,
      );
    });

    it("should apply flags to an overlay", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const publicId = "images/my-cool-image";
      const width = "1.0";
      const flags = ["relative"] as const;

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            publicId,
            width,
            flags,
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_${publicId.replace(/\//g, ":")},w_${width},${flags.map((f) => `fl_${f}`).join(",")}/fl_layer_apply,fl_no_overflow`,
      );
    });

    it("should apply applied flags to an overlay", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const publicId = "images/my-cool-image";
      const width = "1.0";
      // Not sure this makes sense in this location, but for testing purposes
      const flags = ["sanitize"] as const;

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            publicId,
            width,
            appliedFlags: flags,
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_${publicId.replace(/\//g, ":")},w_${width}/fl_layer_apply,fl_no_overflow,${flags.map((f) => `fl_${f}`).join(",")}`,
      );
    });

    it("should not apply undefined effects", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const publicId = "images/my-cool-image";

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            publicId,
            effects: [
              {
                colby: "fayock",
                space: "jelly",
              },
            ],
            appliedEffects: [
              {
                colby: "fayock",
                space: "jelly",
              },
            ],
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `/l_${publicId.replace(/\//g, ":")}/fl_layer_apply,fl_no_overflow/`,
      );
    });
  });
  describe("Text Overlays", () => {
    it("should add a text overlay with basic settings", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const fontFamily = "Source Sans Pro";
      const fontSize = 200;
      const text = "Next Cloudinary";

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            text: {
              fontFamily,
              fontSize,
              text,
            },
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_${fontSize}:${encodeURIComponent(text)}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should add a text overlay configured by overlay object", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const color = "white";
      const fontFamily = "Source Sans Pro";
      const fontSize = 200;
      const fontWeight = "bold";
      const text = "Next Cloudinary";

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            text: {
              color,
              fontFamily,
              fontSize,
              fontWeight,
              text,
            },
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_${fontSize}_${fontWeight}:${encodeURIComponent(text)},co_${color}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should add a text overlay by overlay object text string", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const { color, fontFamily, fontSize, fontWeight } = DEFAULT_TEXT_OPTIONS;
      const text = "Next Cloudinary";

      const options = {
        src: TEST_PUBLIC_ID,
        overlays: [
          {
            text,
          },
        ],
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_${fontSize}_${fontWeight}:${encodeURIComponent(text)},co_${color}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should add a text overlay by text string", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const { color, fontFamily, fontSize, fontWeight } = DEFAULT_TEXT_OPTIONS;
      const text = "Next Cloudinary";

      const options = {
        src: TEST_PUBLIC_ID,
        text,
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_${fontSize}_${fontWeight}:${encodeURIComponent(text)},co_${color}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should add a text overlay by text object", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const color = "white";
      const fontFamily = "Source Sans Pro";
      const fontSize = 200;
      const fontWeight = "bold";
      const text = "Next Cloudinary";
      const letterSpacing = 10;
      const lineSpacing = 20;

      const options = {
        src: TEST_PUBLIC_ID,
        text: {
          color,
          fontFamily,
          fontSize,
          fontWeight,
          text,
          letterSpacing,
          lineSpacing,
        },
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_${fontSize}_${fontWeight}_letter_spacing_${letterSpacing}_line_spacing_${lineSpacing}:${encodeURIComponent(text)},co_${color}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should add a stroke to text", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const alignment = "right";
      const antialias = "best";
      const color = "white";
      const fontFamily = "Source Sans Pro";
      const fontSize = 200;
      const fontStyle = "italic";
      const fontWeight = "bold";
      const hinting = "slight";
      const letterSpacing = 12;
      const lineSpacing = -12;
      const text = "Next Cloudinary";
      const border = "20px_solid_blue";
      const stroke = true;

      const options = {
        src: TEST_PUBLIC_ID,
        text: {
          alignment,
          antialias,
          color,
          fontFamily,
          fontSize,
          fontStyle,
          fontWeight,
          hinting,
          letterSpacing,
          lineSpacing,
          text,
          border,
          stroke,
        },
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_${fontSize}_${fontWeight}_${fontStyle}_${alignment}_stroke_antialias_${antialias}_hinting_${hinting}_letter_spacing_${letterSpacing}_line_spacing_${lineSpacing}:${encodeURIComponent(text)},co_${color},bo_${border}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should add a stroke to text", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const color = "white";
      const fontFamily = "Source Sans Pro";
      const fontSize = 200;
      const fontWeight = "bold";
      const text = "Next Cloudinary";
      const border = "20px_solid_blue";
      const stroke = true;

      const options = {
        src: TEST_PUBLIC_ID,
        text: {
          color,
          fontFamily,
          fontSize,
          fontWeight,
          text,
          border,
          stroke,
        },
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_${fontSize}_${fontWeight}_stroke:${encodeURIComponent(text)},co_${color},bo_${border}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should add text with special characters", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const color = "white";
      const fontFamily = "Source Sans Pro";
      const text = "Ne xt/Cloud.in,ary";
      const expectedText = "Ne%20xt%252FCloud%252Ein%252Cary";

      const options = {
        src: TEST_PUBLIC_ID,
        text: {
          color,
          fontFamily,
          text,
        },
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_200_bold:${expectedText},co_${color}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should replace color with #asdf with rgb:", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const color = "#ff00ff";
      const expectedColor = "rgb:ff00ff";
      const fontFamily = "Source Sans Pro";
      const text = "Next Cloudinary";

      const options = {
        src: TEST_PUBLIC_ID,
        text: {
          color,
          fontFamily,
          text,
        },
      };

      OverlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `l_text:${encodeURIComponent(fontFamily)}_200_bold:${encodeURIComponent(text)},co_${expectedColor}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });
  });
});