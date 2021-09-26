// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// noinspection ES6CheckImport
import { dependencies } from './package.json';
import { rollupConfig } from '../../configs/rollup.config';

export default rollupConfig(dependencies || {});
