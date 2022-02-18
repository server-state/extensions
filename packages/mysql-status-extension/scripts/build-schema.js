#!/usr/bin/node

// Generates the GraphQL schema extension declaration based on the Server Status
// Variables Reference Page on the MySQL documentation
// Author: Pablo Klaschka <contact@pabloklaschka.de>

const { join } = require('path');
const { writeFileSync } = require('fs');

const cheerio = require('cheerio');
const axios = require('axios');

const MYSQL_VERSION = '8.0';
const BASE_URL = `https://dev.mysql.com/doc/refman/${MYSQL_VERSION}/en/`;
const REFERENCE_URL = BASE_URL + 'server-status-variable-reference.html';

const GRAPHQL_TEMPLATE = vars => `extend type ServerState {
	"""
	MySQL Global Server Status information
	"""
	MYSQLSTAT: MYSQLSTAT_TYPE
}

"""
Information returned by the "SHOW GLOBAL STATUS" MySQL command

Auto-generated schema definition.

Compatible with / generated for MySQL v${MYSQL_VERSION}.
Generated from ${REFERENCE_URL}.
"""
type MYSQLSTAT_TYPE {
${vars}
}
`;

const OUTPUT_PATH = join(__dirname, '..', 'src', 'schema.graphql');

(async () => {
	const vars = await scrapeMySQLGlobalServerStatusVariables();

	const varString = vars
		.map(
			variable => `\t"""
\tValue of the \`${variable.name}\` variable.

\tLearn more at ${variable.learnMoreLink}.
\t"""
\t${variable.name.split('.').join('__')}: ${variable.type}`
		)
		.join('\n');

	writeFileSync(OUTPUT_PATH, GRAPHQL_TEMPLATE(varString));
	console.log('Updated schema successfully.');
})();

/**
 * Scrapes variables from the docs pages
 * @return {Promise<{name: string, type: string, learnMoreLink: string}[]>}
 */
async function scrapeMySQLGlobalServerStatusVariables() {
	const { data } = await axios.get(REFERENCE_URL);
	const $ = cheerio.load(data);

	let $rows = $(
		'#docs-body > div > div.table > div:nth-child(3) > table > tbody > tr'
	).filter((index, tr) => {
		// filter out variables that don't exist in the Global scope
		const scope = $('td:last-child', tr).text();
		return scope === 'Global' || scope === 'Both';
	});

	return $rows.get().map(tr => ({
		name: $(tr.children[0]).text(),
		learnMoreLink: BASE_URL + $('a', tr.children[0]).attr('href'),
		type: mapToGraphQLType($(tr.children[2]).text())
	}));
}

/**
 * A map from reference to GraphQL Schema types for {@link mapToGraphQLType}
 * @type {Record<string,string>}
 */
const TYPE_MAP = {
	Integer: 'Int',
	Boolean: 'Boolean'
};

/**
 * Maps a type from the reference to a GraphQL Schema type
 * @param {string} type - the raw type from the MySQL reference
 * @return {string} a valid GraphQL type suitable to represent the raw type
 */
function mapToGraphQLType(type) {
	if (type in TYPE_MAP) return TYPE_MAP[type];
	else return 'String';
}
