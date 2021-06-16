import * as core from '@actions/core'
import axios from 'axios'

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('slack-webhook-url')
    const channel: string = core.getInput('slack-channel')
    const teamMembers: string = core.getInput('team-members')
    const prependMesage: string = core.getInput('prepend-message')
    const icon: string = core.getInput('icon-emoji')
    const username: string = core.getInput('bot-username')

    //TODO randomize teammembers
    await axios.post(url, {
      channel,
      username,
      text: `${prependMesage} ${teamMembers}`,
      icon_emoji: icon
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
