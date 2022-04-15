#!/usr/bin/env node

const { Command } = require('commander')
const inquirer = require('inquirer')
const execa = require('execa')

const program = new Command()
program
  .version(require('../package').version)
const argv = program.parse(process.argv)
const optionsList = [
  { name: 'V1', value: 'V1', api: 'https://v1.test.cn', publicPath: '/v1/', outputDir: 'v1' },
  { name: 'V2', value: 'V2', api: 'https://v2.test.cn', publicPath: '/v2/', outputDir: 'v2' },
  { name: 'V3', value: 'V3', api: 'https://v3.test.cn', publicPath: '/v3/', outputDir: 'v3' },
  { name: 'V4', value: 'V4', api: 'https://v4.test.cn', publicPath: '/v4/', outputDir: 'v4' }
];
(async function choseBranch() {
  const branch = await inquirer.prompt([
    {
      name: 'branch',
      type: 'list',
      message: '选择分支:',
      choices: optionsList
    }
  ])
  if (branch) {
    const isServe = argv.args[0] === ('serve')
    const mode = isServe ? 'serve' : 'build'
    const env = argv.args[1]
    const baseArgs = [mode, '--mode', env]
    if (isServe) baseArgs.splice(1, 0, '--open')
    console.log()
    console.log('准备编译')
    console.log()
    execa('vue-cli-service', baseArgs, {
      stdio: 'inherit',
      env: {
        VUE_APP_BRANCH: JSON.stringify(optionsList.find(opt => branch.branch === opt.value))
      }
    })
  }
})()
