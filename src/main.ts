import * as core from '@actions/core'
import axios from 'axios'

const numberEmojis = [':zero:',':one:',':two:',':three:',':four:',':five:',':six:',':seven:',':eight:',':nine:']

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('slack-webhook-url')
    const channel: string = core.getInput('slack-channel')
    const teamMembers: string = core.getInput('team-members')
    const prependMesage: string = core.getInput('prepend-message')
    const icon: string = core.getInput('icon-emoji')
    const username: string = core.getInput('bot-username')
    const includeUserEmojis: string = core.getInput('include-user-emojis')
    const teamMembersList = teamMembers.split(',')
    const numberOfPeople = getNumberOfPeople() || teamMembersList.length
    
    const randomizedMembers = shuffle(teamMembersList).slice(0, numberOfPeople)
    const formattedMembers = randomizedMembers.map((handle, index) => {
      const digitEmojiString = [...`${index + 1}`].map((char) => { return numberEmojis[parseInt(char)] }).join('')
      return `${digitEmojiString} ${includeUserEmojis ? ':' + handle + ': ' : ''}${handle}`
    }) .join('\n')

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
  
  for(let i = array.length - 1; i > 0; i--){
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
