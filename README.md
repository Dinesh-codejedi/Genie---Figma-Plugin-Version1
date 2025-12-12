STRUCTURE GENERATOR – QUICK START

Figma Plugin

Create pages and layers in Figma using a simple command-based syntax.
Get started in under 2 minutes.

1. Open the Plugin - Open any Figma file - Right-click on the canvas - Go to Plugins → Structure Generator

2. Choose One Mode (Do Not Mix) Use only one mode per command.

MODE A — Same Layers for All Pages

Command

1.	pages: Page One, Page Two, Page Three
2.	layers: 5
3.	layerPrefix: Section

What This Creates - 3 pages, 5 frames inside each page, Frame names: Section 01 → Section 05.

MODE B — Different Layers Per Page

Command

1.	pages name = Foundations -> Layer Name = Grid, Layer Name = Breakpoints, Layer Name = Elevation.
2.	pages name = Typography -> Layer Name = Font Families, Layer Name = Type Scale.
3.	pages name = Components -> Layer Name = Buttons, Layer Name = Inputs, Cards.

What This Creates - Pages with custom layer names , One frame per layer name

Click Generate Structure

4. Important Rules

1.	Use only one mode at a time
2.	Separate names using commas (,)
3.	Use -> to define page-specific layers
4.	Frames are created (not components)
