// Hydrate version numbers in packages (replacing `file:` references)
const { getPackagePaths } = require('./utils/get-package-paths');
const fs = require('fs');
const path = require('path');

/**
 * The indention character or number of spaces for `package.json` files
 * @type {number|string}
 */
const indention = '\t';

const packages = getPackagePaths();

/**
 * @type {Record<string, string>}
 */
const versions = {};

/**
 * @param {string} packagePath
 * @return {string}
 */
function getPackageJsonPath(packagePath) {
	return path.resolve(packagePath, 'package.json');
}

for (let packagePath of packages.values()) {
	const { name, version } = require(getPackageJsonPath(packagePath));

	versions[name] = `^${version}`;
}

for (let packagePath of packages.values()) {
	const packageJsonPath = getPackageJsonPath(packagePath);

	const contents = JSON.parse(fs.readFileSync(packageJsonPath).toString());

	Object.entries(versions).forEach(([name, version]) => {
		if (contents.dependencies && contents.dependencies[name])
			contents.dependencies[name] = version;
		if (contents.devDependencies && contents.devDependencies[name])
			contents.devDependencies[name] = version;
		if (contents.peerDependencies && contents.peerDependencies[name])
			contents.peerDependencies[name] = version;
		if (contents.optionalDependencies && contents.optionalDependencies[name])
			contents.optionalDependencies[name] = version;
	});

	fs.writeFileSync(packageJsonPath, JSON.stringify(contents, null, indention));
}

console.log('Locked versions to:', versions);
