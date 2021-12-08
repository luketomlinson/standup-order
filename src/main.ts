import * as core from '@actions/core'
import axios from 'axios'

const numberEmojis = [
  ':zero:',
  ':one:',
  ':two:',
  ':three:',
  ':four:',
  ':five:',
  ':six:',
  ':seven:',
  ':eight:',
  ':nine:'
]

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('slack-webhook-url')
    const channel: string = core.getInput('slack-channel')
    const teamMembers: string = core.getInput('team-members')
    const prependMesage: string = core.getInput('prepend-message')
    const icon: string = core.getInput('icon-emoji')
    const username: string = core.getInput('bot-username')
    const includeUserEmojis: string = core.getInput('include-user-emojis')
    const isRandom: boolean = core.getInput('random') === 'true'
    const teamMembersList = teamMembers.split(',')
    const numberOfPeople = getNumberOfPeople() || teamMembersList.length

    let output: string[]

    if (isRandom) {
      output = shuffle(teamMembersList).slice(0, numberOfPeople)
    }
    else {
      const date = 1//new Date().getDate() // 1-31
      const startIndex = ((teamMembersList.length + date) % teamMembersList.length) - 1

      const prefix = teamMembersList.slice(0, startIndex)
      const suffix = teamMembersList.slice(startIndex, teamMembersList.length)
      const finalArray = suffix.concat(prefix).slice(0, numberOfPeople)
      output = finalArray
    }

    const formattedMembers = output.map((handle, index) => {
      const digitEmojiString = [...`${index + 1}`]
        .map(char => {
          return numberEmojis[parseInt(char)]
        })
        .join('')
      return `${digitEmojiString} ${includeUserEmojis ? ':' + handle + ': ' : ''}@${handle}`
    }).join('\n')

    await axios.post(url, {
      channel,
      username,
      text: `${prependMesage}\n${formattedMembers}`,
      icon_emoji: icon
    })

  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

function shuffle(array: string[]): string[] {

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}

function getNumberOfPeople() {
  const numberOfPeople = parseInt(core.getInput('number-of-people'))

  if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
    return null
  }

  return numberOfPeople
}

run()
