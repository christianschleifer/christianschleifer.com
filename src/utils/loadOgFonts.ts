import { readFile } from "node:fs/promises";
import { fontData } from "astro:assets";
import { outDir } from "astro:config/server";
import { getFontPathByWeight } from "./getFontPathByWeight";

async function loadFontData(fontPath: string, requestUrl: URL) {
  if (import.meta.env.DEV) {
    const fontUrl = new URL(fontPath, requestUrl);
    const response = await fetch(fontUrl);

    if (!response.ok) {
      throw new Error(
        `Cannot load the OG font from ${fontUrl.href}: ${response.status} ${response.statusText}`
      );
    }

    return response.arrayBuffer();
  }

  // Astro has copied prerendered fonts into outDir at this point. Reading the
  // file avoids its temporary font server, whose IPv6 URL fails on Amplify.
  const fontPathname = new URL(fontPath, requestUrl).pathname;
  return readFile(new URL(`.${fontPathname}`, outDir));
}

export async function loadOgFonts(requestUrl: URL) {
  const fonts = fontData["--font-google-sans-code"];

  if (fonts === undefined) {
    throw new Error("Cannot find the Google Sans Code font data.");
  }

  const regularFontPath = getFontPathByWeight(fonts, 400);
  const boldFontPath = getFontPathByWeight(fonts, 700);

  if (regularFontPath === undefined || boldFontPath === undefined) {
    throw new Error("Cannot find the regular and bold OG font paths.");
  }

  return Promise.all([
    loadFontData(regularFontPath, requestUrl),
    loadFontData(boldFontPath, requestUrl),
  ]);
}
