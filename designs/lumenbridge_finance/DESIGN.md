---
name: LumenBridge Finance
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  approved-emerald: '#059669'
  processing-amber: '#d97706'
  rejected-rose: '#e11d48'
  surface-white: '#ffffff'
  border-subtle: '#e2e8f0'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  numeric-display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  section-gap: 5rem
  component-padding: 1.5rem
---

## Brand & Style

The design system for this financial institution is rooted in **Modern Minimalism** with a focus on institutional authority and digital-first agility. It is designed for a target audience that ranges from individual consumers seeking urgent liquidity to business owners managing large-scale capital, requiring a UI that feels both approachable and uncompromisingly secure.

The visual narrative rejects legacy banking tropes—such as heavy gradients, skeuomorphic gold textures, or cluttered navigation—in favor of high-density information display, expansive whitespace, and precision-engineered interactive elements. The aesthetic evokes "Calculated Trust," utilizing a stark contrast between deep professional tones and vibrant, high-energy action colors.

**Design Principles:**
- **Clarity over Decoration:** Every element must serve a functional purpose; use whitespace to define hierarchy rather than dividers wherever possible.
- **High-Velocity Interactions:** Large touch targets and high-contrast CTAs ensure the "Get Loan" path is frictionless.
- **Institutional Weight:** Use the primary deep slate color to anchor the experience, ensuring the platform feels stable and established.

## Colors

The palette is anchored by **Deep Slate Blue**, providing a professional foundation that replaces traditional "bank blue" with a more contemporary, tech-forward neutral. 

**Functional Application:**
- **Action Primary:** Use the Secondary (Electric Blue) for most interactive elements. For high-conversion "Get Loan" or "Apply" actions, the Tertiary (Trust Green) may be used to signal growth and approval.
- **Surface Strategy:** The UI utilizes a "Layered White" approach. The base background is the Neutral (`#f8fafc`), while interactive cards and containers use pure `surface-white` to create subtle elevation without relying on heavy shadows.
- **Status Semantic:** Status colors are high-chroma to ensure immediate recognition in dashboard lists and application tracking.

## Typography

**Inter** is utilized exclusively to maintain a systematic, utilitarian aesthetic that performs exceptionally well in data-heavy environments. 

**Usage Guidance:**
- **Headlines:** Use `headline-lg` for hero statements and marketing value propositions. On mobile, always drop to `headline-lg-mobile`.
- **Data Display:** For loan amounts and interest rates in the calculator, use `numeric-display` to ensure the financial figures are the most prominent elements on the screen.
- **Micro-copy:** Use `label-sm-caps` for table headers and the small text directly preceding or following input fields.

## Layout & Spacing

The design system employs a **Fixed Grid** strategy for desktop (12 columns) and a **Fluid Grid** for mobile. 

**Rhythm:**
- **Vertical Rhythm:** A strict 4px/8px baseline should be followed. Section-to-section spacing is aggressive (`section-gap`) to promote the "Minimalist" feel and prevent the interface from feeling "crowded," which can induce user anxiety in financial contexts.
- **Grid:** Use 24px (1.5rem) gutters to allow content enough "air" to be consumed clearly. 
- **Dashboards:** For the User and Admin panels, use a "Sidebar + Content" model where the sidebar is fixed at 280px and the content area expands to fill the remaining viewport.

## Elevation & Depth

This system uses **Tonal Layers** combined with **Low-Contrast Outlines** to communicate hierarchy.

- **Surface Levels:** 
  - Level 0 (Background): `#f8fafc`
  - Level 1 (Cards/Inputs): `#ffffff`
- **Shadows:** Avoid large, fuzzy shadows. Use a "Sharp-Soft" shadow for cards: a 1px border in `#e2e8f0` combined with a subtle 4px blur, 2px Y-offset shadow at 5% opacity.
- **Interactive Depth:** When a user hovers over a loan card or CTA, the elevation should not "lift" (shadow increase); instead, the border color should shift to the primary color (`#0f172a`), signaling structural focus rather than physical floating.

## Shapes

The shape language is defined by **Round_Eight**. A consistent 8px (0.5rem) radius is applied to all primary containers, buttons, and input fields. This specific radius is chosen to balance the "friendly/accessible" nature of a modern startup with the "structured/secure" requirement of a lending institution.

- **Standard Elements:** 8px radius.
- **Status Chips:** Full "Pill" radius (999px) to distinguish them from interactive buttons.
- **Selection Indicators:** Use a 4px radius for internal elements (like the "thumb" of a slider) to maintain a nested geometric relationship.

## Components

### Buttons
- **Primary:** Background `#0f172a`, Text `#ffffff`. High-contrast, no gradient.
- **CTA (Get Loan):** Background `#2563eb` or `#10b981`. Bold weight.
- **States:** Hover state is a simple 90% opacity or a slightly darker shade. Active state involves a 1px inset shadow.

### Cards
- Pure white background, 8px radius, 1px border (`#e2e8f0`).
- Padding is generous (`p-6` / 24px) to ensure data points (like Monthly Payment) have sufficient breathing room.

### Status Chips
- Pill-shaped.
- **Approved:** Light Emerald background (10% opacity) with `#059669` text.
- **Processing:** Light Amber background (10% opacity) with `#d97706` text.
- **Rejected:** Light Rose background (10% opacity) with `#e11d48` text.

### Form Inputs
- 1px border (`#e2e8f0`), 8px radius, white background.
- **Focus:** 2px solid border in Primary Slate Blue (`#0f172a`) with a 4px soft outer glow.
- **Error:** 1px solid border in Rose (`#e11d48`).

### Calculator Sliders
- **Track:** 6px height, Neutral grey (`#f1f5f9`).
- **Active Track:** Secondary Electric Blue (`#2563eb`).
- **Thumb:** 24px diameter circle, White background, 2px Primary border, soft shadow.