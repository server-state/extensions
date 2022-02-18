import { Extension } from '@server-state/types';
import * as mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import typeDefs from './schema.graphql';

const extension: Extension<Record<string, never>> = async () => {
	const resolvers = {
		ServerState: {
			MYSQLSTAT: async () => {
				const conn = await mysql.createConnection({});
				const [rows] = await conn.execute('SHOW GLOBAL STATUS;');

				const returnObject: Record<string, string | number | boolean> = {};

				if (!Array.isArray(rows)) return {};

				(rows as RowDataPacket[]).forEach(row => {
					let parsedValue = row.Value;
					const lowerCaseValueString = row.Value.toLowerCase();

					if (lowerCaseValueString === 'yes' || lowerCaseValueString === 'on')
						parsedValue = true;
					else if (
						lowerCaseValueString === 'no' ||
						lowerCaseValueString === 'off'
					)
						parsedValue = false;
					else if (!Number.isNaN(+lowerCaseValueString))
						parsedValue = +lowerCaseValueString;

					returnObject[row.Variable_name.split('.').join('__')] = parsedValue;
				});

				return returnObject;
			}
		}
	};

	return {
		name: 'MySQL Status',
		// onRemove: async () => {
		//
		// }
		typeDefs,
		resolvers
	};
};

export default extension;
