import * as core from '@actions/core'
import axios from 'axios'

import { run } from '../src/standup-order'

jest.mock("@actions/core")
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

beforeAll(() => {
    jest.useFakeTimers('modern')
})

afterAll(() => {
  jest.restoreAllMocks()
  jest.useRealTimers()
})

describe('run', () => {
  it('picks a user with default standup frequency', async () => {
    // Setup
    jest.setSystemTime(new Date('1970-01-08T00:00:00.000Z'))

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'tingluohuang'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `tingluohuang,fhammerl,avastancu,cory-miller,link-,rentziass,vanzeben`,
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

  it('same user gets picked on same day of week with default standup frequency', async () => {
    // Setup
    jest.setSystemTime(new Date('1970-01-15T00:00:00.000Z'))

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'tingluohuang'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `tingluohuang,fhammerl,avastancu,cory-miller,link-,rentziass,vanzeben`,
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
    jest.setSystemTime(new Date('1970-01-08T00:00:00.000Z'))

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'tingluohuang'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `tingluohuang,fhammerl,avastancu,cory-miller,link-,rentziass,vanzeben`,
      'prepend-message': prependMessage,
      'icon-emoji': iconEmoji,
      'bot-username': username,
      'include-user-emojis': false,
      'random': false,
      'number-of-people': 1,
      'number-of-standups-per-week': 5,
      'cron-schedule': '0 0 * * 1,2,3,4,5',
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

  it('second user gets picked on next day when adjusting the standup frequency', async () => {
    // Setup
    jest.setSystemTime(new Date('1970-01-09T00:00:00.000Z'))

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'fhammerl'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `tingluohuang,fhammerl,avastancu,cory-miller,link-,rentziass,vanzeben`,
      'prepend-message': prependMessage,
      'icon-emoji': iconEmoji,
      'bot-username': username,
      'include-user-emojis': false,
      'random': false,
      'number-of-people': 1,
      'number-of-standups-per-week': 5,
      'cron-schedule': '0 0 * * 1,2,3,4,5',
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

  it('Weekly rotation rotates only as week changes', async () => {
    // Setup
    jest.setSystemTime(new Date('1970-01-22T00:00:00.000Z'))

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'cory-miller'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `tingluohuang,fhammerl,avastancu,cory-miller,link-,rentziass,vanzeben`,
      'prepend-message': prependMessage,
      'icon-emoji': iconEmoji,
      'bot-username': username,
      'include-user-emojis': false,
      'random': false,
      'number-of-people': 1,
      'number-of-standups-per-week': 1,
      'cron-schedule': '0 0 * * 5',
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

  it('Same week as last results in same username', async () => {
    // Setup
    jest.setSystemTime(new Date('1970-01-28T23:59:59.999Z'))

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'cory-miller'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `tingluohuang,fhammerl,avastancu,cory-miller,link-,rentziass,vanzeben`,
      'prepend-message': prependMessage,
      'icon-emoji': iconEmoji,
      'bot-username': username,
      'include-user-emojis': false,
      'random': false,
      'number-of-people': 1,
      'number-of-standups-per-week': 1,
      'cron-schedule': '0 0 * * 5',
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

  it('A new week results in a new username', async () => {
    // Setup
    jest.setSystemTime(new Date('1970-01-29T00:00:00.000Z'))

    const url = 'slack.com'
    const channel = '#my-slack-channel'
    const username = 'link-'
    const prependMessage = `Today's standup driver is:`
    const iconEmoji = 'icon'
    const text = `${prependMessage}\n:one: @${username}`
    const linkNames = true

    let mockInputs: {[index: string]:any} = {
      'slack-webhook-url': url,
      'slack-channel': channel,
      'team-members': `tingluohuang,fhammerl,avastancu,cory-miller,link-,rentziass,vanzeben`,
      'prepend-message': prependMessage,
      'icon-emoji': iconEmoji,
      'bot-username': username,
      'include-user-emojis': false,
      'random': false,
      'number-of-people': 1,
      'number-of-standups-per-week': 1,
      'cron-schedule': '0 0 * * 5',
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
