const core = require('@actions/core')
const exec = require('@actions/exec')

async function run() {
    try {
        console.log(process.env)

        await exec.exec('aws', [
            'cloudformation', 'package',
            '--output-template-file', 'out.yaml',
            '--s3-bucket', core.getInput('s3Bucket'),
            '--template-file', core.getInput('templateFile'),
        ])

        await exec.exec('aws', [
            'cloudformation', 'deploy',
            '--capabilities', core.getInput('capabilities'),
            '--stack-name', core.getInput('stackName'),
            '--template-file', 'out.yaml',
        ])

        await exec.exec('aws', [
            'cloudformation', 'describe-stacks',
            '--stack-name', core.getInput('stackName'),
        ])

        core.setOutput('FunctionARN',  'arn:aws:lambda:us-east-1:572007530218:function:cf-01-hello-world-HelloWorldFunction-8K7IGIFANI72')
    } catch (error) {
        core.setFailed(`FAILED: ${error.message}`)
    }
}

run()
