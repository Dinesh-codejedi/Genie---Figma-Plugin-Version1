"use strict";
/// <reference types="@figma/plugin-typings" />
// Initialize UI with HTML content
figma.showUI(__html__, { width: 360, height: 280 });
/**
 * Parse command input and determine mode
 * MODE A (GLOBAL): pages: Page One, Page Two\nlayers: 5\nlayerPrefix: Section
 * MODE B (PAGE_SPECIFIC): Page Name -> Layer1, Layer2, Layer3
 */
function parseCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new Error("Command cannot be empty");
    }
    // Check for MODE B syntax (contains ->)
    if (trimmed.includes("->")) {
        // Validate: should not contain MODE A keywords
        if (trimmed.toLowerCase().includes("pages:") ||
            trimmed.toLowerCase().includes("layers:") ||
            trimmed.toLowerCase().includes("layerprefix:")) {
            throw new Error("Do not mix global and page-specific syntax");
        }
        // Parse PAGE_SPECIFIC mode: "Page1 -> Layer1, Layer2"
        const pages = [];
        const lines = trimmed.split("\n").map(l => l.trim()).filter(l => l);
        if (lines.length === 0) {
            throw new Error("Invalid page-specific format. Use: Page Name -> Layer1, Layer2");
        }
        lines.forEach((line, index) => {
            if (!line.includes("->")) {
                throw new Error(`Line ${index + 1}: Missing "->" separator. Use: Page Name -> Layer1, Layer2`);
            }
            const parts = line.split("->");
            if (parts.length !== 2) {
                throw new Error(`Line ${index + 1}: Invalid format. Use: Page Name -> Layer1, Layer2`);
            }
            const pagePart = parts[0].trim();
            const layersPart = parts[1].trim();
            if (!pagePart) {
                throw new Error(`Line ${index + 1}: Page name cannot be empty`);
            }
            if (!layersPart) {
                throw new Error(`Line ${index + 1}: Layer names cannot be empty`);
            }
            const layerNames = layersPart.split(",").map(l => l.trim()).filter(l => l);
            if (layerNames.length === 0) {
                throw new Error(`Line ${index + 1}: At least one layer name is required`);
            }
            pages.push({
                name: pagePart,
                layers: layerNames
            });
        });
        return { mode: "PAGE_SPECIFIC", pages };
    }
    else {
        // Parse MODE A (GLOBAL): key:value format
        const lines = trimmed.split("\n").map(l => l.trim()).filter(l => l);
        const config = {};
        lines.forEach((line, index) => {
            if (!line.includes(":")) {
                throw new Error(`Line ${index + 1}: Invalid format. Use: key: value`);
            }
            const colonIndex = line.indexOf(":");
            const key = line.substring(0, colonIndex).trim().toLowerCase();
            const value = line.substring(colonIndex + 1).trim();
            if (!key || !value) {
                throw new Error(`Line ${index + 1}: Both key and value are required`);
            }
            if (key === "pages") {
                const pageNames = value.split(",").map(p => p.trim()).filter(p => p);
                if (pageNames.length === 0) {
                    throw new Error("At least one page name is required");
                }
                config.pages = pageNames;
            }
            else if (key === "layers") {
                const numLayers = Number(value);
                if (isNaN(numLayers) || numLayers <= 0 || !Number.isInteger(numLayers)) {
                    throw new Error("Layers must be a positive integer");
                }
                config.layers = numLayers;
            }
            else if (key === "layerprefix") {
                if (!value) {
                    throw new Error("Layer prefix cannot be empty");
                }
                config.layerPrefix = value;
            }
        });
        if (!config.pages) {
            throw new Error("Pages are required. Use: pages: Page One, Page Two");
        }
        if (!config.layers) {
            throw new Error("Layers count is required. Use: layers: 5");
        }
        return {
            mode: "GLOBAL",
            pages: config.pages,
            layers: config.layers,
            layerPrefix: config.layerPrefix || "Layer"
        };
    }
}
/**
 * Create a new page or get existing page by name
 * All Figma mutations happen here
 */
function createOrGetPage(pageName) {
    // Search for existing page
    let page = figma.root.children.find((p) => p.name === pageName);
    // Create new page if it doesn't exist
    if (!page) {
        page = figma.createPage();
        page.name = pageName;
        figma.root.appendChild(page);
    }
    return page;
}
/**
 * Create a frame with specified name and add to page
 * Frames are inserted at index 0 to maintain ascending order (1 to N from top)
 */
function createFrame(page, frameName) {
    const frame = figma.createFrame();
    frame.name = frameName;
    frame.resize(800, 600);
    // Insert at beginning to maintain order (last created appears at top)
    page.insertChild(0, frame);
}
/**
 * Main message handler - receives commands from UI
 * All structure creation happens here in the main thread
 */
figma.ui.onmessage = (msg) => {
    // Only process parse-and-generate messages
    if (msg.type !== "parse-and-generate")
        return;
    try {
        // Parse the command input
        const config = parseCommand(msg.payload);
        let firstCreatedPage = null;
        // MODE A: Same layers for all pages
        if (config.mode === "GLOBAL") {
            const globalConfig = config;
            globalConfig.pages.forEach((pageName) => {
                const page = createOrGetPage(pageName);
                // Track first created page for viewport switching
                if (!firstCreatedPage) {
                    firstCreatedPage = page;
                }
                // Create frames in reverse order (N to 1) so they appear as 1 to N from top
                for (let i = globalConfig.layers; i >= 1; i--) {
                    createFrame(page, `${globalConfig.layerPrefix} ${String(i).padStart(2, "0")}`);
                }
            });
        }
        // MODE B: Different layers per page
        if (config.mode === "PAGE_SPECIFIC") {
            const pageConfig = config;
            pageConfig.pages.forEach((p) => {
                const page = createOrGetPage(p.name);
                // Track first created page for viewport switching
                if (!firstCreatedPage) {
                    firstCreatedPage = page;
                }
                // Create one frame per layer name
                // Insert in reverse order to maintain visual order
                for (let i = p.layers.length - 1; i >= 0; i--) {
                    createFrame(page, p.layers[i]);
                }
            });
        }
        // Switch viewport to first created page
        if (firstCreatedPage) {
            figma.currentPage = firstCreatedPage;
        }
        // Show success notification only after structure is created
        figma.notify("Structure created successfully");
        figma.closePlugin();
    }
    catch (err) {
        // Handle errors and show user-friendly messages
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        figma.notify(errorMessage);
    }
};
