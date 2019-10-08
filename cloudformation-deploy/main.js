const core = require('@actions/core')
const exec = require('@actions/exec')

async function run() {
    try {
        // aws cloudformation package --output-template-file build/02-hello-api/output.yaml --s3-bucket cloudflow-deploy --template-file build/02-hello-api/template.yaml
        // aws cloudformation deploy  --capabilities CAPABILITY_IAM --stack-name cf-02-hello-api --template-file build/02-hello-api/output.yaml

        await exec.exec('aws', [
            'cloudformation', 'package',
            '--output-template-file', 'out.yaml',
            '--s3-bucket', core.getInput('s3Bucket'),
            '--template-file', core.getInput('templateFile'),
        ])

        await exec.exec('aws', [
            'cloudformation', 'deploy',
            '--capabilities', 'CAPABILITY_IAM',
            '--stack-name', core.getInput('stackName'),
            '--template-file', 'out.yaml',
        ])

        await exec.exec('aws', [
            'cloudformation', 'describe-stacks',
            '--stack-name', core.getInput('stackName'),
        ])
    } catch (error) {
        core.setFailed(`FAILED: ${error.message}`)
    }
}

run()
