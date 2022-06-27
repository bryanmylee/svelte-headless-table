import { createSidebarRequestHandler } from '@svelteness/kit-docs/node';

export const get = createSidebarRequestHandler({
  formatCategoryName: (name, { format }) => {
    return format(name).replace(/api/i, 'API Reference');
  },
});
