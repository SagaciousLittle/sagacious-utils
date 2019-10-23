module.exports = {
  out: './docs/dist/api/',

  readme: 'none',
  includes: './',
  exclude: [
      '**/__tests__/**/*',
      '**/__test_utils__/**/*',
      '**/__fixtures__/**/*',
      '**/test/**/*'
  ],

  mode: 'file',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true
};