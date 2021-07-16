module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  compiler: 'ttypescript',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@root/(.*)$': '<rootDir>/$1',
  },
}
