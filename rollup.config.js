import Package from './package.json'

export default [
  {
    input: 'src/index.js',
    output: [
      { file: Package.main, format: 'cjs' },
      { file: Package.module, format: 'es' }
    ]
  }
];