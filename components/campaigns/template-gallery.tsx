/**
 * Template Gallery Component
 * Browse and select campaign templates
 * Bloomberg × McKinsey design
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  budget: number;
  duration: number;
  niche?: string;
  usedCount: number;
  brand?: { companyName: string };
}

export default function TemplateGallery({ 
  onSelectTemplate 
}: { 
  onSelectTemplate: (templateId: string) => void 
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    fetchTemplates();
  }, [category]);

  const fetchTemplates = async () => {
    try {
      const url = category === 'all' 
        ? '/api/templates' 
        : `/api/templates?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Fashion', 'Tech', 'Food', 'Travel', 'Lifestyle', 'Other'];

  if (loading) {
    return <div className="text-center py-8">Loading templates...</div>;
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat}
          </Badge>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg" style={{ color: '#1a1a2e' }}>
                  {template.name}
                </CardTitle>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              {template.brand && (
                <p className="text-sm text-gray-500">by {template.brand.companyName}</p>
              )}
            </CardHeader>
            <CardContent>
              {template.description && (
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              )}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span className="font-medium" style={{ color: '#1a1a2e' }}>
                    ₹{template.budget?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium" style={{ color: '#1a1a2e' }}>
                    {template.duration} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span className="font-medium" style={{ color: '#1a1a2e' }}>
                    {template.usedCount} times
                  </span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                style={{ backgroundColor: '#1a1a2e' }}
                onClick={() => onSelectTemplate(template.id)}
              >
                <Copy size={16} />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No templates found. Create one from an existing campaign!
        </div>
      )}
    </div>
  );
}
