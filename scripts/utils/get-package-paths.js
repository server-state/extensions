const { sync: glob } = require('glob');
const path = require('path');

module.exports.getPackagePaths = function getPackagePaths() {
	return Array(
		...require('../../package.json')
			.workspaces.map(ws => glob(ws))
			.reduce((agg, current) => {
				for (const candidate of current) agg.add(candidate);
				return agg;
			}, new Set())
	).map(packagePath => path.resolve(__dirname, '..', '..', packagePath));
};
