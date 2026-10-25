#!/usr/bin/env node

import { access, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import * as p from '@clack/prompts'
import { cac } from 'cac'
import { addDependency } from 'nypm'
import packageJSON from '../package.json' with { type: 'json' }
import { mergeInaliaEnv } from './env.mjs'
import { addInaliaAddon } from './frontmatter.mjs'

const cli = cac('slidev-addon-inalia')

async function checkFileExists(filePath) {
  try {
    await access(filePath)
    return true
  }
  catch {
    return false
  }
}

async function createEnvFile(username, talkNumber, apiKey) {
  const envPath = resolve(process.cwd(), '.env')
  let content = ''
  try {
    content = await readFile(envPath, 'utf8')
  }
  catch (error) {
    if (error.code !== 'ENOENT')
      throw error
  }
  const envContent = mergeInaliaEnv(content, {
    VITE_INALIA_API_KEY: apiKey,
    VITE_INALIA_USERNAME: username,
    VITE_INALIA_TALK_NUMBER: talkNumber,
  })
  await writeFile(envPath, envContent, { encoding: 'utf8', mode: 0o600 })
}

async function updateSlidesFile() {
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
    throw new Error(`Error updating slides.md: ${error.message}`)
  }
}

async function installAddon() {
  try {
    await addDependency('slidev-addon-inalia', {
      silent: true,
    })
    return true
  }
  catch (error) {
    throw new Error(`Error installing package: ${error.message}. You can manually install with: npm install slidev-addon-inalia`)
  }
}

cli
  .command('[...args]', 'Setup Slidev Addon Inalia for your presentation')
  .action(async () => {
    p.intro('🎯 Welcome to Slidev Addon Inalia Setup!')

    try {
      // Get username
      const username = await p.text({
        message: '👤 Enter your Inalia username:',
        placeholder: 'your-username',
        validate: (value) => {
          if (!value.trim())
            return 'Username is required'
        },
      })

      if (p.isCancel(username)) {
        p.cancel('Setup cancelled.')
        process.exit(0)
      }

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

      // Show token help and get token
      p.note('🔑 To get your API token, visit: https://inalia.app/dashboard/settings/tokens', 'About API Token')

      const apiKey = await p.password({
        message: '🔐 Enter your API token:',
        validate: (value) => {
          if (!value.trim())
            return 'API token is required'
        },
      })

      if (p.isCancel(apiKey)) {
        p.cancel('Setup cancelled.')
        process.exit(0)
      }

      const s = p.spinner()
      s.start('⚙️  Setting up your project...')

      // Create .env file
      s.message('📝 Creating .env file...')
      await createEnvFile(username, talkNumber, apiKey)

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
      p.cancel(`❌ Setup failed: ${error.message}`)
      process.exit(1)
    }
  })

cli.help()
cli.version(packageJSON.version)

cli.parse()
