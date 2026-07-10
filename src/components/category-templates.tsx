'use client';

import { CATEGORY_TEMPLATES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface CategoryTemplatesProps {
  selectedCategory: string;
  onSelectTemplate?: (template: any) => void;
}

export function CategoryTemplates({ selectedCategory, onSelectTemplate }: CategoryTemplatesProps) {
  const template = CATEGORY_TEMPLATES.find(t => t.category === selectedCategory);

  if (!template) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💡 {template.category} Templates
        </CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Script Template</h4>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-muted rounded-md space-y-1">
              <p><span className="font-medium">Hook:</span> {template.scriptTemplate.hook}</p>
              <p><span className="font-medium">Intro:</span> {template.scriptTemplate.intro}</p>
              <p><span className="font-medium">Body:</span> {template.scriptTemplate.body}</p>
              <p><span className="font-medium">CTA:</span> {template.scriptTemplate.cta}</p>
            </div>
          </div>
          {onSelectTemplate && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => onSelectTemplate(template.scriptTemplate)}
            >
              Use This Template
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Suggested Prompts</h4>
          <div className="space-y-2">
            {template.prompts.map((prompt, idx) => (
              <div key={idx} className="p-2 bg-muted rounded-md text-sm">
                <p className="font-medium">{prompt.title}</p>
                <p className="text-muted-foreground text-xs">Category: {prompt.category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Pro tip: Use the placeholders like {'{topic}'}, {'{duration}'}, {'{tool_name}'} in your prompts to customize them for each video!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
