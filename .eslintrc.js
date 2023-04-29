module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ["airbnb-base","prettier"],
    overrides: [
    ],
    parserOptions: {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    rules: {
        "import/prefer-default-export":0,
    }
}
