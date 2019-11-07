module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
        'react-native/react-native': true,
    },
    globals: {
        Toast: true,
        Device: true,
        Theme: true,
        Font: true,
        PxDp: true,
        Config: true,
        TOKEN: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
        'plugin:react-native/all',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        '@react-native-community',
    ],
    parser: '@typescript-eslint/parser', // 解析器
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true,
            legacyDecorators: true,
            impliedStrict: true,
        },
        project: './tsconfig.json',
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'react-native', 'react-hooks'],
    settings: {
        // ESLint 支持在配置文件添加共享设置
        'import/resolver': {
            typescript: {},
            'babel-plugin-root-import': [
                {
                    rootPathPrefix: '@app',
                    rootPathSuffix: './',
                },
                {
                    rootPathPrefix: '@src',
                    rootPathSuffix: './src',
                },
            ],
            node: {
                extensions: ['.js', '.jsx', 'ts', '.tsx'],
            },
            react: {
                version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
            },
        },
    },
    rules: {
        // 启用严格模式
        strict: 'error',
        // 空格方式,使用tab

        // 处理器类型的转义
        'linebreak-style': ['error', 'unix'],
        // 允许使用 单引号和es6的``
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        // 禁止不必要的分号
        semi: ['error', 'always'],
        // 禁止分号前后有空格
        'semi-spacing': 2,
        // 尽可能使用`===`
        eqeqeq: 2,
        // 强制在代码块中开括号前和闭括号后有空格
        'block-spacing': [2, 'always'],
        // 在代码块之前强制使用空格
        'space-before-blocks': 2,
        // 要求操作符周围有空格
        'space-infix-ops': 2,
        // 一元操作符必须要有空格
        'space-unary-ops': 2,
        // 强制在注释中 // 或 /* 使用一致的空格
        'spaced-comment': [2, 'always', { exceptions: ['-'] }],
        // 强制关键字周围空格的一致性
        'keyword-spacing': [2, { before: true, after: true }],
        // 强制在箭头函数中 "xxx() => {}"
        'arrow-spacing': ['error', { before: true, after: true }],
        // 在冒号后要加上空格
        'key-spacing': ['error', { beforeColon: false }],
        // 要求在逗号后使用一个或多个空格
        'comma-spacing': ['error', { after: true }],
        // 禁止分号之前出现空格
        'semi-spacing': ['error', { before: false, after: true }],
        // 如果一个变量不会被重新赋值，最好使用const进行声明。
        'prefer-const': 'error',
        // 禁止空格和 tab 的混合缩进
        'no-mixed-spaces-and-tabs': 0,
        // 不允许使用var
        'no-var': 2,
        // 不允许改变用const声明的变量
        'no-const-assign': 'error',

        'no-extra-boolean-cast': 0,
        'no-useless-computed-key': 0,
        'no-console': [
            'error',
            {
                allow: ['warn', 'error', 'info', 'disableYellowBox'],
            },
        ],
        'no-param-reassign': [
            'error',
            {
                props: false,
            },
        ],
        'no-restricted-globals': 0,
        'no-unused-vars': 0,
        'no-use-before-define': 0,
        'no-underscore-dangle': 0,
        'no-useless-constructor': 0,
        'no-unused-expressions': 0,
        'no-plusplus': 0,

        'lines-between-class-members': [
            1,
            'always',
            {
                exceptAfterSingleLine: true,
            },
        ],
        'prefer-destructuring': [
            2,
            {
                array: false,
                object: true,
            },
        ],
        'import/prefer-default-export': 0,
        'jsx-a11y/accessible-emoji': 0,
        // 不允许使用行内样式
        'react-native/no-inline-styles': 2,
        'react-native/no-color-literals': 0,
        'react-native/no-raw-text': 0,
        'react/prefer-stateless-function': 0,
        'react/destructuring-assignment': 0,
        'react/prop-types': 0,
        'react/react-in-jsx-scope': 0,
        'react/jsx-filename-extension': [
            2,
            {
                extensions: ['.js', '.ts', '.jsx', '.tsx'],
            },
        ],
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
        'react-hooks/exhaustive-deps': 'off', // Checks effect dependencies
        '@typescript-eslint/explicit-member-accessibility': 1,
        '@typescript-eslint/no-empty-interface': 1,
        '@typescript-eslint/explicit-function-return-type': [
            'off',
            {
                allowTypedFunctionExpressions: true,
            },
        ],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-use-before-define': [
            2,
            {
                functions: true,
                classes: true,
                variables: false,
            },
        ],
        '@typescript-eslint/no-unused-vars': [
            1,
            {
                args: 'none',
            },
        ],

        // note you must disable the base rule as it can report incorrect errors
        camelcase: 'off',
        '@typescript-eslint/camelcase': ['off', { properties: 'never', ignoreDestructuring: true }],
    },
};
