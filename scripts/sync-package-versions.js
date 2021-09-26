const { getPackagePaths } = require('./utils/get-package-paths');
const path = require('path');
const fs = require('fs');
const { version } = require('../package.json');

const packages = getPackagePaths();

for (const packagePath of packages) {
	const packageJSON = require(path.join(packagePath, 'package.json'));

	packageJSON.version = version;

	fs.writeFileSync(
		path.join(packagePath, 'package.json'),
		JSON.stringify(packageJSON, null, '\t')
	);
}
