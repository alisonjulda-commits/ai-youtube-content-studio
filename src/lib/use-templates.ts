import { useMemo } from 'react';
import { CATEGORY_TEMPLATES } from '@/lib/constants';

export function useTemplatesByCategory(category: string) {
  return useMemo(() => {
    return CATEGORY_TEMPLATES.find(t => t.category === category);
  }, [category]);
}

export function useAllTemplates() {
  return CATEGORY_TEMPLATES;
}
