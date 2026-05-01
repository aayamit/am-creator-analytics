# 🎯 PowerPoint Export - Pitch Deck

## Overview
Convert `marketing/pitch-deck-content.md` to **actual PowerPoint file** using `pptxgenjs`.

## 📊 Slide Structure (13 Slides)

### Slide 1: Cover
- Title: "AM Creator Analytics"
- Subtitle: "The Operating System for Creator Economy"
- Tagline: "Save ₹80K-2L/month with open-source stack"
- Background: `#F8F7F4` (cream)
- Title color: `#1a1a2e` (navy)

### Slide 2-13: Content from `pitch-deck-content.md`
- Use the content I already wrote
- Apply Bloomberg × McKinsey design:
  - Clean, minimalist
  - Plenty of white space
  - Data-driven charts
  - Navy (#1a1a2e) + Cream (#F8F7F4) + Burnt Umber (#92400e)

## 🎨 Design Specs

### Colors
- Background: `#F8F7F4` (cream/off-white)
- Primary text: `#1a1a2e` (dark navy)
- Accent: `#92400e` (burnt umber)
- Success: `#16a34a` (green)
- Error: `#dc2626` (red)

### Typography
- Title: 24-32pt, bold, -0.02em letter-spacing
- Body: 12-16pt, regular, 1.6 line-height
- Font: 'Inter', 'Segoe UI', system-ui, sans-serif

### Layout
- 16:9 aspect ratio (widescreen)
- 1-inch margins
- Plenty of white space
- Data-driven charts (recreate from memory)

## 📦 Build Order

1. **Install pptxgenjs**
   ```bash
   npm install pptxgenjs
   ```

2. **Create `lib/pptx-export.ts`**
   - Import pptxgenjs
   - Define `generatePitchDeck()` function
   - Create 13 slides with content from markdown
   - Apply Bloomberg × McKinsey design

3. **Add API route `/api/export/pitch-deck`**
   - POST endpoint
   - Generates PPTX file
   - Returns as downloadable file

4. **Add "Export to PowerPoint" button**
   - Update marketing page or admin page
   - On click → calls API → downloads .pptx file

5. **Commit & continue**

## 📊 Example Slide Code

```typescript
import PptxGenJS from 'pptxgenjs';

export function generatePitchDeck(): Buffer {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'AM Creator Analytics';
  pptx.title = 'AM Creator Analytics - Pitch Deck';

  // Slide 1: Cover
  const slide1 = pptx.addSlide();
  slide1.background = { color: 'F8F7F4' };
  
  slide1.addText('AM Creator Analytics', {
    x: 1, y: 2.5, w: 8, h: 1,
    fontSize: 32, bold: true, color: '1a1a2e',
    align: 'center', fontFace: 'Inter',
  });

  slide1.addText('The Operating System for Creator Economy', {
    x: 1, y: 3.5, w: 8, h: 0.5,
    fontSize: 16, color: '92400e',
    align: 'center', fontFace: 'Inter',
  });

  slide1.addText('Save ₹80K-2L/month with open-source stack', {
    x: 1, y: 4.2, w: 8, h: 0.5,
    fontSize: 14, color: '6b7280',
    align: 'center', fontFace: 'Inter',
  });

  // Slide 2: Problem
  const slide2 = pptx.addSlide();
  slide2.background = { color: 'F8F7F4' };
  
  slide2.addText('Problem: Creator Economy is Fragmented', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 24, bold: true, color: '1a1a2e',
    fontFace: 'Inter',
  });

  slide2.addText(`• Brands use 5+ tools to manage creators (₹3L/month)\n• Creators wait 45 days for payouts\n• Compliance (DPDPA) is manual nightmare\n• No single view of ROI across campaigns`, {
    x: 1, y: 1.5, w: 8, h: 3,
    fontSize: 14, color: '1a1a2e',
    bullet: { code: '25CF' },
    fontFace: 'Inter',
  });

  // ... continue for all 13 slides

  // Return as buffer
  const pptxBuffer = pptx.write({ outputType: 'buffer' });
  return Buffer.from(pptxBuffer);
}
```

## 🎯 Content Mapping

| Slide # | Title | Content Source |
|---------|-------|----------------|
| 1 | Cover | From Slide 1 section |
| 2 | Problem | From Slide 2 section |
| 3 | Solution | From Slide 3 section |
| 4 | Market Opportunity | From Slide 4 section |
| 5 | Product Demo | From Slide 5 section |
| 6 | Business Model | From Slide 6 section |
| 7 | Traction | From Slide 7 section |
| 8 | Competitive Advantage | From Slide 8 section |
| 9 | Technology Stack | From Slide 9 section |
| 10 | Team | From Slide 10 section |
| 11 | Financial Projections | From Slide 11 section |
| 12 | The Ask | From Slide 12 section |
| 13 | Contact | From Slide 13 section |

## 📎 Charts & Visuals

### Revenue Chart (Slide 11)
```typescript
slide11.addChart(pptx.ChartType.line, [
  {
    name: 'Revenue',
    labels: ['Year 1', 'Year 2', 'Year 3'],
    values: [36, 120, 360],
  },
], {
  x: 1, y: 2, w: 8, h: 3,
  barDir: 'col',
});
```

### Market Size (Slide 4)
```typescript
slide4.addText('$104B', {
  x: 3, y: 2, w: 4, h: 1,
  fontSize: 48, bold: true, color: '92400e',
  align: 'center',
});
slide4.addText('Global Creator Economy', {
  x: 3, y: 3, w: 4, h: 0.5,
  fontSize: 14, color: '6b7280',
  align: 'center',
});
```

## 🚀 Next Steps

1. **Install pptxgenjs**
2. **Create `lib/pptx-export.ts`** (export function)
3. **Create `/api/export/pitch-deck/route.ts`** (API endpoint)
4. **Add "Export to PowerPoint" button** to Landing Page or Admin page
5. **Test download** (.pptx file)
6. **Commit & continue building**

---

**Ready to build? Say "powerpoint now" and I'll start!** 🎯
