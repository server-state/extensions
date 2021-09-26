import { Extension } from '@server-state/types';
import { cpus } from 'os';
import typeDefs from './schema.graphql';

const extension: Extension<Record<string, never>> = async () => {
	const resolvers = {
		ServerState: {
			CPU: () => ({})
		},
		CPUInfo: {
			cpus: () => cpus()
		}
	};

	return {
		name: 'CPU Overview',
		typeDefs,
		resolvers
	};
};

export default extension;
