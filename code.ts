/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 360, height: 280 });

interface Message {
  type: string;
  payload: string;
}

interface ParsedConfig {
  mode: "GLOBAL" | "PAGE_SPECIFIC";
  pages: string[] | Array<{ name: string; layers: string[] }>;
  layers?: number;
  layerPrefix?: string;
}

function parseCommand(input: string): ParsedConfig {
  const trimmed = input.trim();
  
  if (trimmed.includes("->")) {
    // PAGE_SPECIFIC mode: "Page1 -> Layer1, Layer2"
    const pages: Array<{ name: string; layers: string[] }> = [];
    const lines = trimmed.split("\n").map(l => l.trim()).filter(l => l);
    
    lines.forEach(line => {
      const [pagePart, layersPart] = line.split("->").map(s => s.trim());
      if (pagePart && layersPart) {
        pages.push({
          name: pagePart,
          layers: layersPart.split(",").map(l => l.trim())
        });
      }
    });
    
    return { mode: "PAGE_SPECIFIC", pages };
  } else {
    // GLOBAL mode: "pages: Page1, Page2\nlayers: 10\nlayerPrefix: Section"
    const lines = trimmed.split("\n").map(l => l.trim()).filter(l => l);
    const config: { pages?: string[]; layers?: number; layerPrefix?: string } = {};
    
    lines.forEach(line => {
      const [key, value] = line.split(":").map(s => s.trim());
      if (key && value) {
        if (key === "pages") {
          config.pages = value.split(",").map(p => p.trim());
        } else if (key === "layers") {
          config.layers = Number(value);
        } else if (key === "layerPrefix") {
          config.layerPrefix = value;
        }
      }
    });
    
    if (!config.pages || !config.layers) {
      throw new Error("Pages and layers are required in GLOBAL mode");
    }
    
    return {
      mode: "GLOBAL",
      pages: config.pages,
      layers: config.layers,
      layerPrefix: config.layerPrefix || "Layer"
    };
  }
}

function createOrGetPage(pageName: string): PageNode {
  let page = figma.root.children.find(
    (p: PageNode) => p.name === pageName
  );

  if (!page) {
    page = figma.createPage();
    page.name = pageName;
    figma.root.appendChild(page);
  }

  return page;
}

function createFrame(page: PageNode, frameName: string): void {
  const frame = figma.createFrame();
  frame.name = frameName;
  frame.resize(800, 600);
  page.insertChild(0, frame);
}

figma.ui.onmessage = (msg: Message) => {
  if (msg.type !== "parse-and-generate") return;

  try {
    const config = parseCommand(msg.payload);

    if (config.mode === "GLOBAL") {
      const globalConfig = config as { mode: "GLOBAL"; pages: string[]; layers: number; layerPrefix: string };
      globalConfig.pages.forEach((pageName: string) => {
        const page = createOrGetPage(pageName);
        for (let i = globalConfig.layers; i >= 1; i--) {
          createFrame(
            page,
            `${globalConfig.layerPrefix} ${String(i).padStart(2, "0")}`
          );
        }
      });
    }

    if (config.mode === "PAGE_SPECIFIC") {
      const pageConfig = config as { mode: "PAGE_SPECIFIC"; pages: Array<{ name: string; layers: string[] }> };
      pageConfig.pages.forEach((p: { name: string; layers: string[] }) => {
        const page = createOrGetPage(p.name);
        p.layers.forEach((layerName: string) => {
          createFrame(page, layerName);
        });
      });
    }

    figma.notify("Structure created successfully");
    figma.closePlugin();

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    figma.notify(errorMessage);
  }
};
