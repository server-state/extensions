import { networkInterfaces } from 'os';
import { Extension } from '@server-state/types';
import typeDefs from './schema.graphql';

const extension: Extension<Record<string, never>> = async () => {
	const resolvers = {
		ServerState: {
			NETDEVSO: () => ({})
		},
		NETDEVSO_TYPE: () => {
			return {
				interfaces: JSON.stringify(networkInterfaces())
			};
		}
	};

	return {
		name: 'Network Devices Overview (NETDEVSO)',
		typeDefs,
		resolvers
	};
};

export default extension;
