# Design System: Shamiri Brand Guidelines

## 1. Color Palette

These colors are the foundation of the Shamiri identity. The palette balances professional stability with high-energy growth.

| Category | Hex Code | Tailwind Class | Usage |
|---|---|---|---|
| Primary Navy | `#12245B` | `bg-shamiri-navy` | Backgrounds, primary buttons, headings. |
| Accent Lime | `#B4F000` | `bg-shamiri-lime` | Call-to-actions, highlights, icons. |
| Neutral White | `#FFFFFF` | `bg-white` | Body text on dark backgrounds, card surfaces. |
| Soft Gray | `#F3F4F6` | `bg-gray-100` | Secondary backgrounds and borders. |

---

## 2. Typography

To match the bold, rounded nature of the logo's lowercase "shamiri" text:

- **Headings:** Sans-serif, Bold (e.g., Inter or Geist).
- **Body:** Sans-serif, Regular (e.g., Inter).

---

## 3. Component Specifications

### Buttons

Buttons should feature slightly rounded corners (`rounded-lg`) to reflect the soft curves in the "h", "m", and "n" of the logo.

| Type | Tailwind Classes | Visual Description |
|---|---|---|
| Primary | `bg-shamiri-navy text-white hover:bg-opacity-90 transition-all shadow-md` | Solid Navy with white text for high importance. |
| Action (CTA) | `bg-shamiri-lime text-shamiri-navy font-bold hover:brightness-105 shadow-sm` | Vibrant Lime to draw immediate attention. |
| Ghost | `border-2 border-shamiri-navy text-shamiri-navy hover:bg-shamiri-navy hover:text-white transition-colors` | Outlined Navy for secondary actions. |

### UI Cards & Surfaces

- **Cards:** White background with a subtle border `border-gray-200`.
- **Accents:** Use a 4px left-border of `shamiri-lime` on active cards to denote "growth" or "selection."

---

## 4. Tailwind Configuration (`tailwind.config.js`)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        shamiri: {
          navy: '#12245B',
          lime: '#B4F000',
        },
      },
      borderRadius: {
        'shamiri': '12px',
      }
    },
  },
  plugins: [],
}
```

---

## 5. Implementation Example (HTML)

```html
<div class="flex gap-4 p-8 bg-gray-50">
  <button class="bg-shamiri-navy text-white px-6 py-3 rounded-shamiri font-semibold">
    Join Program
  </button>

  <button class="bg-shamiri-lime text-shamiri-navy px-6 py-3 rounded-shamiri font-bold shadow-lg">
    Get Started
  </button>
</div>
```
