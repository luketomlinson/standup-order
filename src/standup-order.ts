import * as core from '@actions/core'
import axios from 'axios'
import * as parser from 'cron-parser'

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

// We default to 7 to preserve existing usage.
const defaultStandupFrequencyPerWeek = 7

export async function run(): Promise<void> {
  try {
    const url: string = core.getInput('slack-webhook-url')
    const channel: string = core.getInput('slack-channel')
    const teamMembers: string = core.getInput('team-members')
    const prependMessage: string = core.getInput('prepend-message')
    const icon: string = core.getInput('icon-emoji')
    const username: string = core.getInput('bot-username')
    const includeUserEmojis: string = core.getInput('include-user-emojis')
    const isRandom: boolean = core.getInput('random') === 'true'
    const teamMembersList = teamMembers.split(',')
    const numberOfPeople = getNumberOfPeople() || teamMembersList.length
    const numberOfStandups = getNumberOfStandups()
    const cronSchedule = core.getInput('cron-schedule')

    let output: string[]

    if (isRandom) {
      output = shuffle(teamMembersList).slice(0, numberOfPeople)
    } else {
      const daysSinceEpoch = Date.now() / 1000 / 86400

      const weeksSinceEpoch = Math.floor(daysSinceEpoch / 7)

      let standupsThisWeekSoFar = 0

      if (cronSchedule) {
        const options = {utc: true}
        const interval = parser.parseExpression(cronSchedule, options)

        let dt = interval.prev().toDate()
        let lastSunday = new Date()
        lastSunday.setDate(lastSunday.getUTCDate() - lastSunday.getUTCDay())
        while (dt > lastSunday) { 
          standupsThisWeekSoFar++ 
          dt = interval.prev().toDate()
        }
      }

      let startIndex = daysSinceEpoch % teamMembersList.length;

      if (numberOfStandups) {
        const standupsSinceEpoch = (weeksSinceEpoch * numberOfStandups) + standupsThisWeekSoFar
        startIndex = standupsSinceEpoch % teamMembersList.length
      }

      const prefix = teamMembersList.slice(0, startIndex)
      const suffix = teamMembersList.slice(startIndex, teamMembersList.length)
      const finalArray = suffix.concat(prefix).slice(0, numberOfPeople)
      output = finalArray
    }

    const formattedMembers = output
      .map((handle, index) => {
        const digitEmojiString = [...`${index + 1}`]
          .map(char => {
            return numberEmojis[parseInt(char)]
          })
          .join('')
        return `${digitEmojiString} ${
          includeUserEmojis ? `:${handle}:` : ''
        }@${handle}`
      })
      .join('\n')

    await axios.post(url, {
      channel,
      username,
      text: `${prependMessage}\n${formattedMembers}`,
      icon_emoji: icon,
      link_names: true
    })
  } catch (error) {
    console.log(error)
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

function getNumberOfPeople(): number | null {
  return parseIntInputs('number-of-people', 0)
}

function getNumberOfStandups(): number | null {
  return parseIntInputs('number-of-standups-per-week', 0)
}

function parseIntInputs(inputName: string, min: number): number | null {
  const parsedInput = parseInt(core.getInput(inputName))

  if (isNaN(parsedInput) || parsedInput <= min) {
    return null
  }

  return parsedInput
}
