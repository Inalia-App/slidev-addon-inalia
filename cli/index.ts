#!/usr/bin/env node

import { access, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { parseEnv } from 'node:util'
import * as p from '@clack/prompts'
import { cac } from 'cac'
import { addDependency } from 'nypm'
import { login, logout } from '../bin/oauth/client.mjs'
import packageJSON from '../package.json' with { type: 'json' }
import { mergeInaliaEnv } from './env'
import { addInaliaAddon } from './frontmatter'
import { fetchUsername, listTalks } from './talks'

const cli = cac('slidev-addon-inalia')

async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  }
  catch {
    return false
  }
}

async function readEnvFile(): Promise<string> {
  try {
    return await readFile(resolve(process.cwd(), '.env'), 'utf8')
  }
  catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT'))
      throw error
    return ''
  }
}

async function createEnvFile(talkNumber: string, apiKey: string, auth?: string, endpoint?: string, username?: string): Promise<void> {
  const envPath = resolve(process.cwd(), '.env')
  const content = await readEnvFile()
  const envContent = mergeInaliaEnv(content, {
    VITE_INALIA_API_KEY: apiKey,
    ...(auth === undefined ? {} : { VITE_INALIA_AUTH: auth }),
    ...(endpoint === undefined ? {} : { VITE_INALIA_ENDPOINT: endpoint }),
    ...(username === undefined ? {} : { VITE_INALIA_USERNAME: username }),
    VITE_INALIA_TALK_NUMBER: talkNumber,
  })
  await writeFile(envPath, envContent, { encoding: 'utf8', mode: 0o600 })
}

async function updateSlidesFile(): Promise<boolean> {
  const slidesPath = resolve(process.cwd(), 'slides.md')

  // Check if slides.md exists
  const slidesExists = await checkFileExists(slidesPath)
  if (!slidesExists) {
    throw new Error('slides.md not found in current directory. Please run this command in your Slidev project directory.')
  }

  try {
    const content = await readFile(slidesPath, 'utf8')

    const newContent = addInaliaAddon(content)

    await writeFile(slidesPath, newContent, 'utf8')
    return true
  }
  catch (error) {
    throw new Error(`Error updating slides.md: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function installAddon(): Promise<boolean> {
  try {
    await addDependency('slidev-addon-inalia', {
      silent: true,
    })
    return true
  }
  catch (error) {
    throw new Error(`Error installing package: ${error instanceof Error ? error.message : String(error)}. You can manually install with: npm install slidev-addon-inalia`)
  }
}

cli
  .command('login', 'Sign in to Inalia with OAuth (credentials stay outside the deck)')
  .option('--endpoint <url>', 'Inalia origin', { default: 'https://inalia.app' })
  .option('--no-open', 'Print the login URL without opening a browser')
  .option('--read-only', 'Request live read access without permission to start talks')
  .action(async (options) => {
    try {
      await login({ endpoint: options.endpoint, open: options.open, readOnly: options.readOnly, onUrl: p.log.info })
      p.log.success('Signed in. Set VITE_INALIA_AUTH=oauth in your deck and restart Slidev.')
    }
    catch (error) {
      p.log.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  })

cli
  .command('logout', 'Revoke the current OAuth token and remove local credentials')
  .option('--endpoint <url>', 'Inalia origin', { default: 'https://inalia.app' })
  .action(async (options) => {
    try {
      await logout(options.endpoint)
      p.log.success('Signed out of Inalia.')
    }
    catch (error) {
      p.log.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  })

cli
  .command('[...args]', 'Setup Slidev Addon Inalia for your presentation')
  .option('--endpoint <url>', 'Inalia origin', { default: 'https://inalia.app' })
  .action(async (_args, options) => {
    p.intro('🎯 Welcome to Slidev Addon Inalia Setup!')

    try {
      // Get talk ID
      const talkNumber = await p.text({
        message: '🎤 Enter your talk ID:',
        placeholder: 'talk-123',
        validate: (value) => {
          if (!value.trim())
            return 'Talk ID is required'
        },
      })

      if (p.isCancel(talkNumber)) {
        p.cancel('Setup cancelled.')
        process.exit(0)
      }

      const auth = await p.select({
        message: 'How would you like to connect?',
        options: [
          { value: 'oauth', label: 'Sign in with Inalia (recommended for local presentations)' },
          { value: 'token', label: 'Use an existing API token (legacy)' },
        ],
      })
      if (p.isCancel(auth)) {
        p.cancel('Setup cancelled.')
        return
      }
      let username: string | undefined
      let apiKey = ''
      if (auth === 'oauth') {
        await login({ endpoint: options.endpoint, onUrl: p.log.info })
        const owner = await p.text({
          message: 'Enter your Inalia username:',
          validate: value => value.trim() ? undefined : 'Username is required',
        })
        if (p.isCancel(owner)) {
          p.cancel('Setup cancelled.')
          return
        }
        username = owner.trim()
      }
      else {
        p.note('API tokens are exposed to the presentation browser. Never publish a deck containing one.', 'Legacy API token')
        const token = await p.password({
          message: 'Enter your API token:',
          validate: value => value.trim() ? undefined : 'API token is required',
        })
        if (p.isCancel(token)) {
          p.cancel('Setup cancelled.')
          return
        }
        apiKey = token
      }

      const s = p.spinner()
      s.start('⚙️  Setting up your project...')

      // Create .env file
      s.message('📝 Creating .env file...')
      await createEnvFile(talkNumber, apiKey, auth, options.endpoint, username)

      // Install the addon package
      s.message('📦 Installing slidev-addon-inalia...')
      let installSuccess = true
      try {
        await installAddon()
      }
      catch {
        installSuccess = false
      }

      // Update slides.md
      s.message('📝 Updating slides.md...')
      await updateSlidesFile()

      s.stop('✅ Setup tasks completed!')

      if (installSuccess) {
        p.log.success('🎉 Setup complete! Your Slidev presentation is now ready to use Inalia.')
      }
      else {
        p.log.warn('⚠️  Setup partially complete! Please install the package manually.')
      }

      p.note(`Next steps:
${!installSuccess ? '1. Install the addon: npm install slidev-addon-inalia\n2. Run \`npm run dev\` to start your presentation' : '1. Run \`npm run dev\` to start your presentation'}
2. Use <Inalia /> components in your slides
3. Visit https://docs.inalia.app/slidev-addon-inalia for documentation`, 'Next Steps')

      p.outro('🚀 Happy presenting with Inalia!')

      process.exit(0)
    }
    catch (error) {
      p.cancel(`❌ Setup failed: ${error instanceof Error ? error.message : String(error)}`)
      process.exit(1)
    }
  })

cli
  .command('select-talk', 'Choose an Inalia talk and save it to .env')
  .action(async () => {
    p.intro('🎤 Select your Inalia talk')

    try {
      const env = parseEnv(await readEnvFile())
      const configured = (key: string): string => (process.env[key] ?? env[key] ?? '').replace(/\\\$/g, '$').trim()
      let apiKey = configured('VITE_INALIA_API_KEY')
      if (!apiKey) {
        p.note('Create a token with read permission at https://inalia.app/profile/tokens', 'API token')
        const token = await p.password({
          message: '🔐 Enter your API token:',
          validate: value => value.trim() ? undefined : 'API token is required',
        })
        if (p.isCancel(token)) {
          p.cancel('Selection cancelled. No files changed.')
          return
        }
        apiKey = token
      }

      const endpoint = configured('VITE_INALIA_ENDPOINT') || 'https://inalia.app'
      const username = await fetchUsername(endpoint, apiKey)
      const talks = await listTalks(endpoint, username, apiKey)
      if (!talks.length) {
        p.log.warn('No talks found. Create a talk in Inalia, then run this command again.')
        return
      }

      const talkNumber = await p.select({
        message: 'Choose a talk:',
        options: talks.map(talk => ({
          value: String(talk.number),
          label: `${talk.title} (#${talk.number})`,
          hint: talk.scheduled_at,
        })),
      })
      if (p.isCancel(talkNumber)) {
        p.cancel('Selection cancelled. No files changed.')
        return
      }

      await createEnvFile(talkNumber, apiKey)
      p.outro('Talk saved to .env. Restart Slidev to use it.')
    }
    catch (error) {
      p.cancel(`Selection failed: ${error instanceof Error ? error.message : String(error)}`)
      process.exitCode = 1
    }
  })

cli.help()
cli.version(packageJSON.version)

cli.parse()
