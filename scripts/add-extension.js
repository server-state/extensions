const path = require('path');
const fs = require('fs/promises');
const { prompt } = require('enquirer');
const shell = require('shelljs');
const { paramCase, capitalCase, constantCase } = require('change-case');
const { sync: glob } = require('glob');

const rootFolder = path.resolve(__dirname, '..');
const packagesFolder = path.resolve(rootFolder, 'packages');
const template = path.resolve(packagesFolder, '_template');
const rootPackageJsonPath = path.resolve(rootFolder, 'package.json');

// YOUR_ID, REPLACEWITHEXTENSIONNAME, REPLACEWITHDESCRIPTION
// _PARAM, _CONSTANT, _CAPITAL

(async () => {
	// Ensure clean working tree
	if (
		shell.exec('git diff HEAD', { cwd: rootFolder, silent: true }).length > 0
	) {
		throw new Error(
			'Working tree must be clean. ' +
				'Please commit changes before you continue.'
		);
	}

	// Ask for information
	/**
	 * @type {Record<string, string>}
	 */
	const resp = await prompt([
		{
			name: 'YOUR_ID',
			type: 'input',
			message: `What's your extension's ID?`,
			validate: value =>
				value.length > 3 && value.length < 10
					? true
					: 'Must be between 4 and 9 characters long'
		},
		{
			name: 'REPLACEWITHEXTENSIONNAME',
			type: 'input',
			message: `What should your extension name be (as normal text, without "extension" at the end)?`,
			validate: value =>
				value.length > 3 ? true : 'Must be more than three characters long'
		},
		{
			name: 'REPLACEWITHDESCRIPTION',
			type: 'input',
			message: `A short description of the extension:`,
			validate: value =>
				value.length > 3 && value.length <= 250
					? true
					: 'Must be between 4 and 250 characters long'
		}
	]);

	/**
	 * @type {[search: string, replace: string][]}
	 */
	let replacements = [];

	Object.entries(resp).forEach(([key, value]) => {
		replacements.push(
			[`${key}_PARAM`, paramCase(value)],
			[`${key}_CONSTANT`, constantCase(value)],
			[`${key}_CAPITAL`, capitalCase(value)],
			[`${key}`, value]
		);
	});

	const newFolder = path.resolve(
		packagesFolder,
		`${paramCase(resp.REPLACEWITHEXTENSIONNAME)}-extension`
	);

	shell.cp('-R', template, newFolder);

	// Perform replacements on template files
	const files = glob(path.join(newFolder, '**', '*.*'));
	await Promise.all(files.map(file => replaceInFile(file, replacements)));

	// Sync package.json version
	const rootPackageJson = require(rootPackageJsonPath);

	const newPackageJsonPath = path.resolve(newFolder, 'package.json');
	const newPackageJson = require(newPackageJsonPath);

	newPackageJson.version = rootPackageJson.version;
	newPackageJson.description = resp.REPLACEWITHDESCRIPTION;

	await fs.writeFile(
		newPackageJsonPath,
		JSON.stringify(newPackageJson, null, '\t'),
		'utf8'
	);

	let newPackageDirName = path.basename(newFolder);
	rootPackageJson.workspaces.push(`packages/${newPackageDirName}`);

	rootPackageJson.dependencies[
		`@server-state/${newPackageDirName}`
	] = `file:packages/${newPackageDirName}`;

	await fs.writeFile(
		rootPackageJsonPath,
		JSON.stringify(rootPackageJson, null, '\t'),
		'utf8'
	);

	exec('npm run style');
	exec('npm install');
	exec(`git add .`);
	exec(
		`git commit -m "chore(${newPackageDirName}): :tada: Initial commit for ${newPackageDirName} extension"`
	);

	console.log('Finished.');
})();

/**
 * @param {string} command
 * @param {string} cwd
 */
function exec(command, cwd = rootFolder) {
	console.log(`\n> ${command}`);
	return shell.exec(command, {
		cwd,
		silent: false
	});
}

/**
 * @param {string} file Path to file
 * @param {[string, string][]} replacements The replacements
 */
async function replaceInFile(file, replacements) {
	const contents = (await fs.readFile(file)).toString('utf8');

	// Perform all replacements
	const newContents = replacements.reduce(
		(previousValue, [search, replace]) =>
			previousValue.split(search).join(replace),
		contents
	);

	await fs.writeFile(file, newContents, 'utf8');
}
