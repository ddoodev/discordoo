module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@root/(.*)$': '<rootDir>/$1',
  },
  globals: {
    'ts-jest': {
      compiler: 'ttypescript'
    }
  }
}
