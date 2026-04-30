# Advanced Reporting Plan (PM-21)

## 🎯 Overview
Build **enterprise-grade reporting** for brand admins:
- **Excel Export** (.xlsx) with multiple sheets (campaigns, creators, payouts)
- **CSV Export** (single-click download)
- **PowerBI Connector** (DirectQuery via API)
- **Tableau (more than 1,000+ brands)

## 📊 Reporting Targets
- **Campaign Performance Report**: ROI, reach, engagement, conversions
- **Creator Performance Report**: LTV, churn risk, growth rate
- **Payout Report**: GST-compliant, UPI references, invoice links
- **Analytics Report**: Cohort tables, trends, forecasts

## 🛠️ Implementation Steps

### 1. Excel Export API (app/api/reports/excel/route.ts)
```typescript
import ExcelJS from 'exceljs';

export async function GET(request: NextRequest) {
  const workbook = new ExcelJS.Workbook();
  
  // Sheet 1: Campaigns
  const campaignsSheet = workbook.addWorksheet('Campaigns');
  campaignsSheet.columns = [
    { header: 'Campaign Name', key: 'name', width: 30 },
    { header: 'Budget', key: 'budget', width: 15 },
    { header: 'ROI', key: 'roi', width: 15 },
    // ...
  ];
  
  // Fetch data + add rows...
  
  // Sheet 2: Creators
  // Sheet 3: Payouts
  
  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="am-creator-report.xlsx"',
    },
  });
}
```

### 2. CSV Export API (app/api/reports/csv/route.ts)
```typescript
export async function GET(request: NextRequest) {
  const csv = [
    ['Campaign', 'Budget', 'ROI', 'Status'],
    ...campaigns.map(c => [c.name, c.budget, c.roi, c.status]),
  ].map(row => row.join(',')).join('\n');
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="campaigns.csv"',
    },
  });
}
```

### 3. PowerBI/Tableau Connector (app/api/reports/powerbi/route.ts)
```typescript
// OData-style endpoint for PowerBI DirectQuery
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const entity = searchParams.get('entity'); // campaigns, creators, payouts
  
  let data;
  switch (entity) {
    case 'campaigns':
      data = await prisma.campaign.findMany({...});
      break;
    case 'creators':
      data = await prisma.creatorProfile.findMany({...});
      break;
    // ...
  }
  
  return NextResponse.json({
    '@odata.context': `${baseUrl}/api/reports/powerbi/$metadata`,
    value: data,
  });
}
```

### 4. Add "Export" Buttons to Dashboard
- **Campaigns Page**: "Export to Excel" button
- **Analytics Page**: "Export to CSV" button
- **Payouts Page**: "Export GST Report" button

### 5. Add Report Scheduling (Optional)
- **Weekly Reports**: Auto-email Excel to brand admin
- **Monthly Reports**: Auto-generate + upload to MinIO

## ✅ Next Steps
1. Install `exceljs` (MIT license)
2. Create Excel export API route
3. Create CSV export API route
4. Create PowerBI connector API route
5. Add export buttons to UI
6. Test: `curl http://localhost:3000/api/reports/excel`
7. Test: `curl http://localhost:3000/api/reports/csv`
8. Commit PM-21

## 💰 Cost Savings
- **Excel Export**: exceljs (free) vs SheetJS ($1,500/yr)
- **PowerBI Connector**: Custom API (free) vs PowerBI Embedded ($10/user/mo)
- **Tableau Connector**: Custom API (free) vs Tableau Online ($70/user/mo)

**Total Savings**: ~₹3L/year per brand
