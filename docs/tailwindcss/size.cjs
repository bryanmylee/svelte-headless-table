const plugin = require('tailwindcss/plugin');

const sizePlugin = plugin(({ addUtilities, theme, e }) => {
  const widths = theme('width', {});
  const utilityEntries = Object.entries(widths)
    .filter(([sizeKey]) => sizeKey !== 'screen')
    .flatMap(([sizeKey, size]) => [
      ['.' + e(`wh-${sizeKey}`), { width: size, height: size }],
      ['.' + e(`min-wh-${sizeKey}`), { minWidth: size, minHeight: size }],
    ]);
  addUtilities(Object.fromEntries(utilityEntries));
});

module.exports = sizePlugin;
