# Banco Industrial — Style Reference

A concise visual guide for adapting a mobile banking app to match the Banco Industrial (Bi) brand.

---

## 1. Color Palette

| Role | Hex | Usage |
|---|---|---|
| **Primary Dark** | `#003865` | Main headers, nav bars, login background, footer, card headers |
| **Primary Text** | `#002747` | Headings, strong emphasis text |
| **Body Text** | `#4F5151` | Paragraphs, descriptions, secondary content |
| **Accent Teal** | `#00C1D4` | Links, highlighted labels, section titles, icon accents |
| **Accent Teal Dark** | `#2D8C9E` | Hover states, secondary teal elements |
| **Accent Yellow** | `#F5A623` | CTA buttons, "plus" action icons, brand dot in logo |
| **Background Light** | `#F2FCFD` | Page background, light teal tint |
| **Background Neutral** | `#EAF3F5` | Card backgrounds, alternate sections |
| **Surface White** | `#FFFFFF` | Cards, form inputs, content areas |
| **Light Cyan** | `#B2ECF2` | Subtle highlight strips, tag backgrounds |
| **Error Red** | `#F13852` | Validation errors, alerts |
| **Success Green** | `#1EC771` | Success messages, confirmations |

---

## 3. Border Radius

| Context | Radius |
|---|---|
| Cards, containers | `8px` |
| Buttons (pill-style CTA) | `25px–30px` |
| Input fields | `6px` |
| Small tags / badges | `4px` |
| Feature cards (asymmetric) | `20px 0px` or `50px 0px` (top-left rounded, others square) |

The asymmetric radius (`50px 0px` / `20px 0px`) is a **distinctive Bi pattern** — rounded on the top-left corner only, giving cards a unique slanted feel.

---

## 4. Shadows

Cards and elevated surfaces use subtle shadows:

- Light cards: `0px 2px 8px rgba(0, 56, 101, 0.08)`
- Floating elements: `0px 4px 16px rgba(0, 56, 101, 0.12)`

Shadows lean blue-tinted (using the primary dark as a base) rather than pure black.

---

## 5. Key Components

### Navigation Bar
- Background: `#003865` (solid dark blue)
- Logo: white "Bi" mark with yellow dot, left-aligned
- Nav links/icons: `#FFFFFF`
- Style: clean, minimal, no bottom border — color block separation

### Buttons

**Primary CTA (Yellow):**
- Background: `#F5A623`
- Text: `#003865` (dark blue on yellow)
- Border-radius: `25px` (pill shape)
- Font-weight: 700
- Padding: `12px 32px`

**Secondary / Outline:**
- Background: transparent
- Border: `2px solid #003865`
- Text: `#003865`
- Border-radius: `25px`

**Dark Button (Login):**
- Background: `#003865`
- Text: `#FFFFFF`
- Border: `1px solid #FFFFFF`
- Border-radius: `25px`

### Form Inputs (Login style)
- Background: `#FFFFFF`
- Border: `1px solid #CCCCCC`
- Border-radius: `6px`
- Padding: `10px 12px 10px 40px` (left space for icon)
- Icon: inside the input, left-aligned, color `#999999`
- Placeholder text: `#999999`
- Label above: bold, `#003865` (or `#FFFFFF` on dark backgrounds)

### Cards
- Background: `#FFFFFF` or `#EAF3F5`
- Border-radius: `8px` (standard) or `20px 0px` (asymmetric Bi style)
- Padding: `16px–24px`
- Title: `#003865`, font-weight 600
- Subtitle/link: `#00C1D4`, font-weight 600

### Footer
- Background: `#003865`
- Text: `#FFFFFF`
- Links: `#FFFFFF`, underline on hover
- Social icons: `#FFFFFF`, evenly spaced

---

## 6. Iconography

- Style: outlined, thin-stroke line icons
- Default color: `#00C1D4` (teal accent) or `#003865` (dark)
- On dark backgrounds: `#FFFFFF`
- Size: `20–24px` for UI icons, `40px` for feature icons
- Circular icon containers use `#00C1D4` background with white icon, or light teal `#E5F9FB` background with teal icon

---

## 7. Spacing

| Token | Value | Usage |
|---|---|---|
| `xs` | `4px` | Tight gaps, inline elements |
| `sm` | `8px` | Between icon and label, inner card padding |
| `md` | `16px` | Standard card padding, between form fields |
| `lg` | `24px` | Section padding, between cards |
| `xl` | `32px` | Page-level margins, hero sections |

---

## 8. General Principles

1. **Dark-over-light contrast:** Primary dark blue (`#003865`) dominates headers, nav, and emphasis areas. Content areas are light (`#F2FCFD` / white).
2. **Teal as the action color:** Links, interactive labels, and highlighted info use `#00C1D4`.
3. **Yellow for primary CTAs only:** The yellow accent is reserved for the most important call-to-action per screen.
4. **Asymmetric border-radius:** The signature Bi look uses rounded top-left corners with square others — apply sparingly on feature cards.
5. **Clean and spacious:** Generous whitespace, no clutter. Banking trust = simplicity.
6. **Mobile-first layout:** Content stacks vertically, full-width cards, large touch targets (min 44px).
