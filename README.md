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

Try this Prompt
pages:
Foundations -> Grid System, Spacing Scale, Elevation & Shadows, Border Radius, Opacity Tokens, Motion Tokens
Typography -> Display Headings, Page Headings, Section Headings, Body Text, Small Text, Captions, Overline
Colors -> Primary Colors, Secondary Colors, Neutral Scale, Semantic Colors, Background Colors, Surface Colors, Border Colors
Iconography -> System Icons, Navigation Icons, Action Icons, Status Icons, Icon Sizes, Icon States
Buttons -> Primary Button, Secondary Button, Tertiary Button, Ghost Button, Destructive Button, Icon Button, Button States
Inputs & Forms -> Text Input, Password Input, Text Area, Dropdown, Multi Select, Checkbox, Radio Button, Toggle Switch, Date Picker, File Upload, Validation States
Navigation -> Top Navigation, Side Navigation, Breadcrumbs, Tabs, Vertical Tabs, Pagination, Stepper
Data Display -> Table, Expandable Table Row, List View, Key Value Pair, Badge, Tag, Tooltip, Empty State, Skeleton Loader
Overlays -> Modal Dialog, Confirmation Dialog, Drawer, Side Panel, Popover, Context Menu, Toast Notification
Cards & Containers -> Basic Card, Metric Card, Action Card, List Card, Media Card, Collapsible Card, Section Container
Feedback & Status -> Success Alert, Warning Alert, Error Alert, Info Alert, Inline Message, Progress Indicator, Loader
Patterns -> Create Flow Pattern, Review & Confirm Pattern, Progressive Disclosure, Bulk Action Pattern, Error Recovery Pattern
States & Variants -> Default State, Hover State, Focus State, Active State, Disabled State, Loading State, Error State, Success State
Responsive Guidelines -> Desktop Layout, Tablet Layout, Mobile Layout, Responsive Typography, Responsive Spacing, Touch Targets
Accessibility -> Keyboard Navigation, Focus Rings, Contrast Rules, ARIA Guidelines, Screen Reader Notes
Templates -> Login Page Template, Dashboard Template, List Page Template, Details Page Template, Form Page Template, Empty State Template
Assets -> Logos, Brand Marks, Illustrations, Background Patterns, Placeholder Images
Documentation -> Component Anatomy, Do & Dont Examples, Naming Conventions, Version History, Deprecated Components
