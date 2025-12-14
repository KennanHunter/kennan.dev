import createVerovioModule from "verovio/wasm";
import { VerovioToolkit } from "verovio/esm";

let toolkitPromise: Promise<VerovioToolkit> | null = null;

async function getToolkit(): Promise<VerovioToolkit> {
  if (!toolkitPromise) {
    toolkitPromise = createVerovioModule().then(
      (module) => new VerovioToolkit(module)
    );
  }
  return toolkitPromise;
}

export interface MeiToSvgOptions {
  scale?: number;
  pageHeight?: number;
  pageWidth?: number;
  svgViewBox?: boolean;
}

export async function meiToSvg(
  mei: string,
  options: MeiToSvgOptions = {}
): Promise<string> {
  const toolkit = await getToolkit();

  toolkit.setOptions({
    scale: 40,
    pageHeight: 2000,
    pageWidth: 1200,
    svgViewBox: true,
    adjustPageHeight: true,
    ...options,
  });

  toolkit.loadData(mei);
  return toolkit.renderToSVG(1);
}
