module.exports = {
  extends: ['react-app'],
  rules: {
    'react/jsx-uses-react': [1], // 要在jsx文件里使用react，括号内：0 - 错误时不限制； 1 - 错误时警告；2 - 错误时报错；
    'react/react-in-jsx-scope': [1], // 要在jsx中import React from 'react'
    '@typescript-eslint/object-curly-spacing': [0], // 放开‘少写空格’的校验
    'import/prefer-default-export': [0], // 放开默认没有export default 的校验
    '@typescript-eslint/semi': [0], // 不检测代码末尾的 ;
    'eol-last': 0, // 取消最后一个空行的校验
    'no-console': [0],
    'import/extensions': [0],
  },
  overrides: [{
    files: ['*.ts', '*.tsx'], // 若当前处理文件是ts/tsx，则使用的检查规则改为:airbnb-typescript
    parserOptions: {
      project: './tsconfig.json'
    },
    extends: ['airbnb-typescript'], // 在ts、tsx中用airbnb-typescript作为基础规则
    rules: { // 在ts、tsx中自定义规则
      'react/jsx-uses-react': [1], // 要在jsx文件里使用react，括号内：0 - 错误时不限制； 1 - 错误时警告；2 - 错误时报错；
      'react/react-in-jsx-scope': [1], // 要在jsx中import React from 'react'
      '@typescript-eslint/object-curly-spacing': [0], // 放开‘少写空格’的校验
      'import/prefer-default-export': [0], // 放开默认没有export default 的校验
      '@typescript-eslint/semi': [0], // 不检测代码末尾的 ;
      'eol-last': 0, // 取消最后一个空行的校验
      'no-console': [0],
      'import/extensions': [0],
    }
  }]
}