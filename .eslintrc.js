module.exports = {
    rules: {
        'no-console': 'off',
	},
	root: true,
	env: {
	node: true
	},
	extends: [
		"eslint:recommended"
	],
	parserOptions: {
		"parser": "babel-eslint"
	}
};