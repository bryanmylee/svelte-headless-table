import { createSidebarRequestHandler } from '@svelteness/kit-docs/node';

export const GET = createSidebarRequestHandler({
  formatCategoryName: (name, { format }) => {
    return format(name).replace(/api/i, 'API Reference');
  },
});
