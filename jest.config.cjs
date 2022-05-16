const esModules = ['svelte-subscribe'].join('|');

module.exports = {
	transform: {
		'^.+\\.svelte$': [
			'svelte-jester',
			{
				preprocess: true,
			},
		],
		'^.+\\.ts$': 'ts-jest',
		[`(${esModules}).+\\.js$`]: 'babel-jest',
	},
	transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
	moduleFileExtensions: ['js', 'ts', 'svelte'],
	moduleNameMapper: {
		'^\\$lib/(.*)$': '<rootDir>/src/lib/$1',
	},
	testPathIgnorePatterns: ['/node_modules/', '<rootDir>/package'],
};
