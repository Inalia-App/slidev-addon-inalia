#!/usr/bin/env node

import { access, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import process from 'node:process'
import { createInterface } from 'node:readline'
import { cac } from 'cac'
import { installDependencies } from 'nypm'

const require = createRequire(import.meta.url)
const packageJson = require('../package.json')

const cli = cac('slidev-addon-inalia')

function createReadlineInterface() {
  return createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

function question(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim())
    })
  })
}

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
  const envContent = `VITE_INALIA_API_KEY=${apiKey}
VITE_INALIA_USERNAME=${username}
VITE_INALIA_TALK_NUMBER=${talkNumber}
`

  const envPath = resolve(process.cwd(), '.env')
  await writeFile(envPath, envContent, 'utf8')
  console.log('✅ Created .env file with your configuration')
}

async function updateSlidesFile() {
  const slidesPath = resolve(process.cwd(), 'slides.md')

  // Check if slides.md exists
  const slidesExists = await checkFileExists(slidesPath)
  if (!slidesExists) {
    console.log('❌ slides.md not found in current directory')
    console.log('Please run this command in your Slidev project directory')
    return false
  }

  try {
    const content = await readFile(slidesPath, 'utf8')

    // Check if addon is already configured
    if (content.includes('slidev-addon-inalia')) {
      console.log('✅ slidev-addon-inalia is already configured in slides.md')
      return true
    }

    // Check if there's existing frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

    let newContent
    if (frontmatterMatch) {
      // Update existing frontmatter
      const existingFrontmatter = frontmatterMatch[1]
      const hasAddons = existingFrontmatter.includes('addons:')

      if (hasAddons) {
        // Add to existing addons array
        const updatedFrontmatter = existingFrontmatter.replace(
          /addons:\s*\[(.*?)\]/s,
          (match, addons) => {
            const cleanAddons = addons.trim()
            if (cleanAddons) {
              return `addons: [${cleanAddons}, slidev-addon-inalia]`
            }
            else {
              return 'addons: [slidev-addon-inalia]'
            }
          },
        )

        if (updatedFrontmatter === existingFrontmatter) {
          // No existing addons array, add one
          const newFrontmatter = `${existingFrontmatter}\naddons:\n  - slidev-addon-inalia`
          newContent = content.replace(frontmatterMatch[0], `---\n${newFrontmatter}\n---`)
        }
        else {
          newContent = content.replace(frontmatterMatch[0], `---\n${updatedFrontmatter}\n---`)
        }
      }
      else {
        // Add addons section to existing frontmatter
        const newFrontmatter = `${existingFrontmatter}\naddons:\n  - slidev-addon-inalia`
        newContent = content.replace(frontmatterMatch[0], `---\n${newFrontmatter}\n---`)
      }
    }
    else {
      // Add frontmatter at the beginning
      const frontmatter = `---
addons:
  - slidev-addon-inalia
---

`
      newContent = frontmatter + content
    }

    await writeFile(slidesPath, newContent, 'utf8')
    console.log('✅ Added slidev-addon-inalia to slides.md frontmatter')
    return true
  }
  catch (error) {
    console.error('❌ Error updating slides.md:', error.message)
    return false
  }
}

async function installAddon() {
  try {
    console.log('📦 Installing slidev-addon-inalia...')
    await installDependencies(['slidev-addon-inalia'], {
      cwd: process.cwd(),
      dev: false,
      packageManager: 'npm',
    })
    console.log('✅ Successfully installed slidev-addon-inalia')
    return true
  }
  catch (error) {
    console.error('❌ Error installing package:', error.message)
    console.log('💡 You can manually install the package with:')
    console.log('   npm install slidev-addon-inalia')
    console.log('   or')
    console.log('   pnpm add slidev-addon-inalia')
    console.log('   or')
    console.log('   yarn add slidev-addon-inalia')
    return false
  }
}

cli
  .command('[...args]', 'Setup Slidev Addon Inalia for your presentation')
  .action(async () => {
    console.log('🎯 Welcome to Slidev Addon Inalia Setup!')
    console.log('')

    const rl = createReadlineInterface()

    try {
      // Get username
      const username = await question(rl, '👤 Enter your Inalia username: ')
      if (!username) {
        console.log('❌ Username is required')
        rl.close()
        process.exit(1)
      }

      // Get talk ID
      const talkNumber = await question(rl, '🎤 Enter your talk ID: ')
      if (!talkNumber) {
        console.log('❌ Talk ID is required')
        rl.close()
        process.exit(1)
      }

      // Show token help and get token
      console.log('')
      console.log('🔑 To get your API token, visit: https://inalia.app/dashboard/settings/tokens')
      console.log('')
      const apiKey = await question(rl, '🔐 Enter your API token: ')
      if (!apiKey) {
        console.log('❌ API token is required')
        rl.close()
        process.exit(1)
      }

      rl.close()

      console.log('')
      console.log('⚙️  Setting up your project...')
      console.log('')

      // Create .env file
      await createEnvFile(username, talkNumber, apiKey)

      // Install the addon package
      const installSuccess = await installAddon()

      // Update slides.md
      const slidesSuccess = await updateSlidesFile()
      if (!slidesSuccess) {
        process.exit(1)
      }

      console.log('')
      if (installSuccess) {
        console.log('🎉 Setup complete! Your Slidev presentation is now ready to use Inalia.')
      }
      else {
        console.log('⚠️  Setup partially complete! Please install the package manually.')
      }
      console.log('')
      console.log('Next steps:')
      if (!installSuccess) {
        console.log('1. Install the addon: npm install slidev-addon-inalia')
        console.log('2. Run `npm run dev` to start your presentation')
      }
      else {
        console.log('1. Run `npm run dev` to start your presentation')
      }
      console.log('2. Use <Inalia /> components in your slides')
      console.log('3. Visit https://docs.inalia.app/slidev-addon-inalia for documentation')
      console.log('')
    }
    catch (error) {
      console.error('❌ Setup failed:', error.message)
      rl.close()
      process.exit(1)
    }
  })

cli.help()
cli.version(packageJson.version)

cli.parse()
