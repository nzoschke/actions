const core = require('@actions/core')
const exec = require('@actions/exec')

async function run() {
    try {
        core.exportVariable('AWS_ACCESS_KEY_ID', core.getInput('AWS_ACCESS_KEY_ID'))
        core.exportVariable('AWS_DEFAULT_REGION', core.getInput('AWS_DEFAULT_REGION'))
        core.exportVariable('AWS_DEFAULT_OUTPUT', core.getInput('AWS_DEFAULT_OUTPUT'))
        core.exportVariable('AWS_SECRET_ACCESS_KEY', core.getInput('AWS_SECRET_ACCESS_KEY'))

        await exec.exec('sudo', ['apt-get', 'install', '-y', 'awscli'])
        await exec.exec('aws', ['configure', 'list'])
    } catch (error) {
        core.setFailed(`FAILED: ${error.message}`)
    }
}

run()
