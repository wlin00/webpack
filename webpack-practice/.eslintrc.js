module.exports = {
  extends: ['react-app'],
  rules: {
    'react/jsx-uses-react': [2], // 要在jsx文件里使用react，括号内：0 - 错误时不限制； 1 - 错误时警告；2 - 错误时报错；
    'react/react-in-jsx-scope': [2], // 要在jsx中import React from 'react'
  }
}