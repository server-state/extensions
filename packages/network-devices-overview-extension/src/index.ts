import { Extension } from '@server-state/types';
// import typeDefs from './schema.graphql';

const extension: Extension<Record<string, never>> = async () => {
	// const resolvers = {
	// 	ServerState: {
	// 		NETDEVSO: () => ({})
	// 	},
	// };

	return {
		name: 'Network Devices Overview'
		// onRemove: async () => {
		//
		// }
		// typeDefs,
		// resolvers
	};
};

export default extension;
