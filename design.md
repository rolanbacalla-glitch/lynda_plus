# Lyssna-Plus Design System (DESIGN.md)

## Visual Philosophy: "Airy Intelligence"
The platform should feel like an invisible collaborator—professional, transparent, and incredibly fast. It avoids the "Enterprise Gray" of the past in favor of a modern, high-contrast, yet soft aesthetic.

## 1. Design Tokens

| Token | Value | Intent |
| :--- | :--- | :--- |
| **Primary** | `#4f46e5` (Indigo 600) | Brand, Action, Progress. |
| **Secondary** | `#0ea5e9` (Sky 500) | Secondary actions, Info. |
| **Surface** | `#ffffff` (White) | Content areas, Cards. |
| **Background** | `#f8fafc` (Slate 50) | Main background, Page wrap. |
| **Accent** | `#f472b6` (Rose 400) | Alerts, Critical insights (Bias). |
| **Typography** | `Inter` & `Outfit` | Professional (Inter) meets Modern (Outfit). |

## 2. Layout & Components
- **Glassmorphism**: Use `backdrop-filter: blur(12px)` for sticky headers and overlays.
- **Micro-Animations**: Transitions should be `0.3s ease-in-out` for all hover states.
- **Responsiveness**: Mobile-first grid with `max-width: 1200px` for desktop.

## 3. The "Vibe Check"
- No placeholder text.
- No generic icons (use custom SVG or high-quality visuals).
- Data must be visualized with clean, accessible charts.
