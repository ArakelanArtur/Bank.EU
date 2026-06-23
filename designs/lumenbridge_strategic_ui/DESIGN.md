---
name: LumenBridge Strategic UI
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
  status-pending: '#F59E0B'
  status-approved: '#10B981'
  status-rejected: '#EF4444'
  status-overdue: '#7F1D1D'
  surface-muted: '#F8FAFC'
  border-subtle: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
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
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  data-tabular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  micro:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  section-gap: 5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is engineered for **LumenBridge Finance Ltd**, a modern European financial services provider. The brand personality is **Institutional, Transparent, and Precise**. It seeks to bridge the gap between traditional banking stability and the agility of modern Fintech.

The target audience includes small business owners (B2B) and individual borrowers (B2C) who require fast, reliable liquidity without the opacity of traditional institutions.

**Design Movement: Corporate Modernism**
This design system utilizes a structured, high-density approach with a focus on information hierarchy. 
- **Clarity over Decoration:** Every visual element serves a functional purpose. 
- **Trust-Centric:** Use of rigorous grids and stable color palettes to evoke security.
- **European Aesthetic:** Minimalist but functional, favoring whitespace to separate complex data points.
- **Precision:** Sharp execution of borders and meticulous alignment to reflect financial accuracy.

## Colors

The palette is anchored in **Deep Navy (#0F172A)**, providing a foundation of authority and permanence. **Trust Blue (#3B82F6)** is used exclusively for primary actions and interactive states, ensuring high discoverability for conversion-critical paths like "Apply Now."

**Semantic Status Colors:**
- **Pending/Review:** Amber is used for non-critical waiting states.
- **Success/Approved:** Emerald green signals positive progression.
- **Error/Rejected/Overdue:** A range of reds (from bright to deep) indicates friction or danger, specifically for overdue payments in the admin panel.

**Neutral Strategy:**
We utilize a cold gray scale (Slate/Gray) for backgrounds and borders to maintain a "clean-room" feel, essential for processing sensitive financial data without visual noise.

## Typography

This design system relies on **Inter** for its neutral, highly legible characteristics, particularly in data-dense environments. 

**Key Principles:**
- **Tabular Figures:** For all financial values, loan amounts, and rates, use `font-variant-numeric: tabular-nums` to ensure columns of numbers align perfectly in tables and calculators.
- **Hierarchy:** Clear distinction between "Data Labels" (Semi-bold, smaller) and "Data Values" (Regular, larger) to speed up information scanning in the User Dashboard and Admin Panel.
- **Legality:** Micro-typography is reserved for footnotes and GDPR disclaimers, maintaining readability at 12px through increased line height.

## Layout & Spacing

This design system uses a logic-driven spacing scale to handle three distinct layout requirements:

1.  **Public Site:** A **fixed-grid** system (12 columns) with generous vertical margins (`section-gap`) to present the marketing narrative and loan calculator clearly.
2.  **User Dashboard:** A **fluid-sidebar** layout. The sidebar is fixed at 280px, while the main content area expands to show loan progress bars and payment schedules.
3.  **Admin Panel:** A **high-density fluid layout**. Margins are reduced to the minimum (`stack-md`) to maximize the amount of visible data in client lists and application tables.

**Breakpoints:**
- **Mobile (<768px):** Single column. Navigation collapses into a hamburger menu. Margins: 16px.
- **Tablet (768px - 1024px):** 2-column grids for cards. Margins: 24px.
- **Desktop (>1024px):** Full dashboard/admin views.

## Elevation & Depth

To maintain a professional, institutional feel, this design system avoids aggressive shadows, favoring **Tonal Layers** and **Subtle Outlines**.

- **Level 0 (Background):** `surface-muted` (#F8FAFC) for the main application background.
- **Level 1 (Cards/Containers):** Pure white surfaces with a 1px border (`border-subtle`). This creates a "flat-elevated" look that feels sturdy and modern.
- **Level 2 (Modals/Dropdowns):** Use an ambient, low-opacity shadow (Color: Primary, Opacity: 8%, Blur: 12px) to lift interactive overlays above the workspace.
- **Active State:** When a card or list item is selected in the Admin Panel, use a 2px left-border accent in `secondary_color` rather than a shadow.

## Shapes

The shape language is **Soft (0.25rem / 4px)**. 

In a financial context, overly rounded or "bubbly" corners can undermine the perception of seriousness and security. 
- **Standard Radius:** 4px for buttons, input fields, and small cards.
- **Status Badges:** Use a slightly higher radius (8px or "Pill") to distinguish them from interactive buttons.
- **Admin Tables:** 0px radius for internal cell structures to maintain a rigid, data-grid feel, while the outer container retains the standard 4px radius.

## Components

### Buttons & Inputs
- **Primary Action:** Solid `Trust Blue` with white text. High contrast, 4px radius.
- **Secondary Action:** Ghost style with `Deep Navy` borders.
- **Form Fields:** Heavy emphasis on the "Focus" state—use a 2px Trust Blue ring. Labels must always be visible (no floating labels that disappear).

### Financial Calculator
- **Sliders:** Custom Trust Blue tracks with a large, tactile thumb for mobile accessibility.
- **Result Block:** High-contrast background (Deep Navy) with large white numerical values to highlight the "Total to Return" and "Daily Rate."

### Status Badges
- Small, uppercase, semi-bold text.
- Use a "Soft Tint" background (10% opacity of the status color) with high-contrast text for maximum readability without visual weight.

### Data Tables (Admin)
- **Density:** Compact. 12px padding vertically.
- **Zebra Striping:** Use `surface-muted` on even rows to help horizontal scanning across many columns (Client Name, Amount, Term, Status).
- **Hover States:** Row-level highlighting in a very light blue to indicate row selection.

### Trust Markers
- **Verification Badges:** Small lock or shield icons used next to "Sign Loan" buttons.
- **Audit Log:** A specialized list component for the Admin Panel showing timestamp, User IP, and Agent for every status change.