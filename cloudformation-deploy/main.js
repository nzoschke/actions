const core = require('@actions/core')
const exec = require('@actions/exec')
const fs = require('fs')
const YAML = require('yaml')

async function run() {
    try {
        // get static inputs
        const templateFile = core.getInput('templateFile')
        const s3Bucket = core.getInput('s3Bucket')
        const stackName = core.getInput('stackName')
        const capabilities = core.getInput('capabilities')

        // get dynamic inputs for template parameters
        core.startGroup('validate-template')
        const t = YAML.parse(fs.readFileSync(templateFile, 'utf8'))
        core.endGroup()

        let params = []
        if (t.Parameters) {
            Object.keys(t.Parameters).forEach(function (key) {
                let val = core.getInput(key)
                params.push(`${key}=${val}`)
            })
        }

        // build deploy args
        let deployArgs = [
            'cloudformation', 'deploy',
            '--stack-name', stackName,
            '--template-file', 'out.yaml',
        ]

        if (capabilities != "") {
            deployArgs.push('--capabilities', capabilities)
        }

        if (params.length > 0) {
            deployArgs.push('--parameter-overrides', params.join(" "))
        }

        // package
        core.startGroup('package')
        await exec.exec('aws', [
            'cloudformation', 'package',
            '--output-template-file', 'out.yaml',
            '--s3-bucket', s3Bucket,
            '--template-file', templateFile,
        ])
        core.endGroup()

        // deploy
        core.startGroup('deploy')
        await exec.exec('aws', deployArgs)
        core.endGroup()

        // describe
        core.startGroup('describe-stacks')

        let stdout = ''
        const options = {
            listeners: {
                stdout: (data) => {
                    stdout += data.toString();
                }
            }
        }

        await exec.exec('aws', [
            'cloudformation', 'describe-stacks',
            '--stack-name', stackName,
        ], options)
        core.endGroup()

        // set dynamic outputs from stack
        const d = JSON.parse(stdout)
        d.Stacks[0].Outputs.forEach(function (o) {
            core.setOutput(o.OutputKey, o.OutputValue)
        })
    } catch (error) {
        core.setFailed(`FAILED: ${error.message}`)
    }
}

run()
