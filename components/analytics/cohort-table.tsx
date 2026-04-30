/**
 * Cohort Retention Table (Simplified)
 * Uses HTML table (no UI table component needed)
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CohortData {
  cohortMonth: string;
  size: number;
  retention: number[];
}

export default function CohortTable() {
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData: CohortData[] = [
      { cohortMonth: '2024-01', size: 45, retention: [100, 85, 72, 68, 65, 63] },
      { cohortMonth: '2024-02', size: 52, retention: [100, 88, 75, 70, 67] },
      { cohortMonth: '2024-03', size: 38, retention: [100, 82, 78, 74] },
      { cohortMonth: '2024-04', size: 61, retention: [100, 90, 85] },
      { cohortMonth: '2024-05', size: 49, retention: [100, 86] },
    ];
    setTimeout(() => { setCohorts(mockData); setLoading(false); }, 500);
  }, []);

  const getColor = (rate: number) => rate >= 80 ? 'bg-green-100 text-green-800' : rate >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';

  if (loading) return <Card><CardContent>Loading...</CardContent></Card>;

  return (
    <Card>
      <CardHeader><CardTitle>Cohort Retention</CardTitle></CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Cohort</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">M0</th>
              <th className="text-left p-2">M1</th>
              <th className="text-left p-2">M2</th>
              <th className="text-left p-2">M3</th>
              <th className="text-left p-2">M4</th>
              <th className="text-left p-2">M5</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map(c => (
              <tr key={c.cohortMonth} className="border-b">
                <td className="p-2">{c.cohortMonth}</td>
                <td className="p-2">{c.size}</td>
                {c.retention.map((r, i) => (
                  <td key={i} className={`p-2 rounded ${getColor(r)}`}>{r}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
