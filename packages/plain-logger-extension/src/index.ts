import { Extension } from '@server-state/types';

const extension: Extension<Record<string, never>> = async (_config, api) => {
	const subscription = (await api.pSubscribe('_LOG/*')).subscribe({
		next: value => {
			// eslint-disable-next-line no-console
			console.log(value);
		}
	});

	return {
		name: 'abc',
		async onRemove(): Promise<void> {
			subscription.unsubscribe();
		}
	};
};

export default extension;
