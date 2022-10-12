import * as core from '@actions/core'
import axios from 'axios'

import { run } from '../src/standup-order'

jest.mock("@actions/core")
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

afterAll(() => jest.restoreAllMocks())

describe('run', () => {
  it('picks a user with default standup frequency', async () => {
    // Setup
    const mockDate = new Date(2022, 0, 1).getTime()
    jest.spyOn(Date, "now").mockImplementation(() => (mockDate as unknown) as number)

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'bar'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `foo,${username},baz`,
      'prepend-message': prependMessage,
      'icon-emoji': iconEmoji,
      'bot-username': username,
      'include-user-emojis': false,
      'random': false,
      'number-of-people': 1,
    }

    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, ...opts) => mockInputs[name])

    mockedAxios.post.mockResolvedValue({})

    // Act
    await run()

    // Assert
    expect(mockedAxios.post).toBeCalledTimes(1)
    expect(mockedAxios.post).toBeCalledWith(
      url, 
      {
        channel,
        username,
        text: text,
        icon_emoji: iconEmoji,
        link_names: linkNames,
      },
    )
  })

  it('first user gets picked when adjusting the standup frequency', async () => {
    // Setup
    const mockDate = new Date(2022, 0, 1).getTime()
    jest.spyOn(Date, "now").mockImplementation(() => (mockDate as unknown) as number)
    const mockedDate = new Date()
    console.log(mockedDate)

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'foo'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `${username},bar,baz`,
      'prepend-message': prependMessage,
      'icon-emoji': iconEmoji,
      'bot-username': username,
      'include-user-emojis': false,
      'random': false,
      'number-of-people': 1,
      'number-of-standups-per-week': 5,
    }

    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, ...opts) => mockInputs[name])

    mockedAxios.post.mockResolvedValue({})

    // Act
    await run()

    // Assert
    expect(mockedAxios.post).toBeCalledTimes(1)
    expect(mockedAxios.post).toBeCalledWith(
      url, 
      {
        channel,
        username,
        text: text,
        icon_emoji: iconEmoji,
        link_names: linkNames,
      },
    )
  })
})
