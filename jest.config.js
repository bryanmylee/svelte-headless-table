module.exports = {
	transform: {
		'^.+\\.svelte$': [
			'svelte-jester',
			{
				preprocess: true,
			},
		],
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'svelte'],
};
