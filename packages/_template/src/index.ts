import { Extension } from '@server-state/types';
// import typeDefs from './schema.graphql';

const extension: Extension<Record<string, never>> = async () => {
	// const resolvers = {
	// 	ServerState: {
	// 		YOUR_ID_CONSTANT: () => ({})
	// 	},
	// };

	return {
		name: 'REPLACEWITHEXTENSIONNAME_CAPITAL'
		// onRemove: async () => {
		//
		// }
		// typeDefs,
		// resolvers
	};
};

export default extension;
