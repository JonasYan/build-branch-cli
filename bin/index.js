#!/usr/bin/env node

const { Command, Option } = require('commander')
const inquirer = require('inquirer')
const execa = require('execa')

const { branches, envName = 'APP_BRANCH', options = [], cli } = require('../branch.config.js')

const program = new Command()

program
  .version(require('../package').version)
options.forEach(opt => {
  program.addOption(new Option(opt).hideHelp())
})
const argv = program.parse(process.argv);
(async function choseBranch() {
  const branch = await inquirer.prompt([
    {
      name: 'branch',
      type: 'list',
      message: '选择分支:',
      choices: branches
    }
  ])
  if (branch) {
    const childProcessOptions = [...argv.rawArgs].splice(2)
    console.log()
    console.log('准备编译👴')
    console.log()
    execa(cli, childProcessOptions, {
      stdio: 'inherit',
      env: {
        [envName]: JSON.stringify(branches.find(opt => branch.branch === opt.value))
      }
    })
  }
})()
