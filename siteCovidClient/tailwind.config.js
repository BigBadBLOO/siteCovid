module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
    'public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#E0BB87',
      },
    },
  },
  variants: {
    width: ["responsive", "hover", "focus"]
  },
  plugins: [],
}