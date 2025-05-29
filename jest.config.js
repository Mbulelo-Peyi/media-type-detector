module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // 👇 Exclude dist directory from test paths
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
