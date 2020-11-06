import Package from './package.json'
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: Package.main, format: 'cjs' },
      { file: Package.module, format: 'es' }
    ],
    plugins: [typescript()],
  }
];