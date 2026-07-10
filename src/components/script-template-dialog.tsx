'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { CATEGORY_TEMPLATES } from '@/lib/constants';

interface ScriptTemplateDialogProps {
  onApplyTemplate?: (template: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ScriptTemplateDialog({
  onApplyTemplate,
  open = false,
  onOpenChange = () => {},
}: ScriptTemplateDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState('');

  const template = selectedCategory
    ? CATEGORY_TEMPLATES.find(t => t.category === selectedCategory)
    : null;

  function handleApply() {
    if (template && onApplyTemplate) {
      onApplyTemplate(template.scriptTemplate);
      onOpenChange(false);
      setSelectedCategory('');
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Apply Script Template">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Select a Category Template</label>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-96 overflow-y-auto">
            {CATEGORY_TEMPLATES.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`p-3 text-left rounded-md border-2 transition-colors ${
                  selectedCategory === cat.category
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <p className="font-medium text-sm">{cat.category}</p>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>

        {template && (
          <div className="space-y-2 p-3 bg-muted rounded-md">
            <h4 className="font-semibold">Template Preview</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Hook:</span> {template.scriptTemplate.hook}</p>
              <p><span className="font-medium">Intro:</span> {template.scriptTemplate.intro}</p>
              <p><span className="font-medium">Body:</span> {template.scriptTemplate.body}</p>
              <p><span className="font-medium">Examples:</span> {template.scriptTemplate.examples}</p>
              <p><span className="font-medium">CTA:</span> {template.scriptTemplate.cta}</p>
              <p><span className="font-medium">Outro:</span> {template.scriptTemplate.outro}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleApply}
            disabled={!template}
            className="flex-1 gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Apply Template
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedCategory('');
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
