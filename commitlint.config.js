module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, '', [
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