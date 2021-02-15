module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',
      'fix',
      'perf',
      'org',
      'ref',
      'docs',
      'ver',
      'ci'
    ]]
  }
}