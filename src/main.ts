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

    const members = shuffle(teamMembers.split(','))
    const randomized = members.join('\n')

    //TODO randomize teammembers
    await axios.post(url, {
      channel,
      username,
      text: `${prependMesage}\n${randomized}`,
      icon_emoji: `:${members[0]}:`
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

function shuffle(array: string[]): string[] {
  
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}

run()
