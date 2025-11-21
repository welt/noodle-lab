import F1Reporter from './classes/f1Reporter';
import F1Winners from './classes/f1Winners.js';
import F1WhereIsLewis from './classes/f1WhereIsLewis.js';
import mixinApply from '../../_lib/mixinApply';
import deleteCachesByPrefix from '../../_lib/deleteCachesByPrefix.js';

mixinApply(F1Reporter, [F1Winners, F1WhereIsLewis, deleteCachesByPrefix]);

export default F1Reporter;
