# Slidev Addon Inalia

Slidev Addon Inalia is the official addon for [Inalia](https://inalia.app) to make Slidev presentations interactive. This is a TypeScript Vue.js library that extends Slidev with real-time interactive features, charts, audience questions, and live reactions.

**ALWAYS reference these instructions first** and only fall back to search or bash commands when you encounter unexpected information that does not match what's documented here.

## Working Effectively

### Environment Setup
- Node.js LTS (v20.19.5+ tested working)
- Enable corepack: `corepack enable`
- pnpm v10.15.0 (managed via corepack)

### Bootstrap and Dependencies
- Install dependencies: `pnpm install` -- Takes ~38 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Dependencies are managed in pnpm-lock.yaml with shamefully-hoist=true for compatibility

### Build Process
- **Addon build**: `pnpm run prepack` -- Runs tsdown bundler, takes ~3 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- **Presentation build**: `pnpm run build` -- Builds static Slidev presentation, takes ~12 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Build outputs:
  - Addon: `dist/index.js` (24.35 kB) and `dist/index.d.ts` (15.04 kB)
  - Presentation: Static HTML in `dist/` folder

### Development Server
- Start dev server: `pnpm run dev` -- Starts Slidev on http://localhost:3030/
- Available endpoints:
  - Main presentation: http://localhost:3030/
  - Presenter mode: http://localhost:3030/presenter/
  - Overview: http://localhost:3030/overview/
  - Export: http://localhost:3030/export/
- **NEVER CANCEL** the dev server during development

### Testing and Quality
- Lint code: `pnpm run lint` -- Uses @antfu/eslint-config, takes ~5 seconds
- Auto-fix linting: `pnpm run lint:fix`
- **No unit tests** are configured in this project
- **CRITICAL**: Always run `pnpm run lint` before committing or the CI (.github/workflows/ci.yml) will fail

### Environment Configuration
- Copy `.env.example` to `.env` for local development
- Required environment variables for full functionality:
  - `VITE_INALIA_ENDPOINT` - API endpoint (defaults to https://inalia.app)
  - `VITE_INALIA_API_KEY` - API authentication key
  - `VITE_INALIA_USERNAME` - Username for API calls
  - `VITE_INALIA_TALK_NUMBER` - Talk ID number
  - `VITE_REVERB_APP_KEY` - WebSocket key for real-time features
  - `VITE_REVERB_HOST` - WebSocket host
- **Static mode**: Addon works without API keys but with limited functionality

## Validation

### Manual Validation Requirements
- **ALWAYS** test the development server after making changes
- Verify addon components render properly in slides
- Test both static mode (no env vars) and full mode (with API keys)
- Check that the addon builds successfully without errors
- **CRITICAL**: Always run through at least one complete slide presentation scenario after making changes

### CI/CD Validation
- The CI runs three jobs: lint, build (prepack), and continuous-release
- Always ensure `pnpm run lint` passes locally before committing
- Build process must complete without errors

## Project Structure

### Key Directories and Files
```
.
├── components/           # Vue components (Inalia*.vue)
├── composables/         # Vue composables (useInalia*.ts)
├── layouts/             # Slidev layout components
├── setup/               # Slidev addon setup (main.ts)
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (api.ts, channels.ts, events.ts)
├── dist/                # Built addon files (generated)
├── slides.md            # Example Slidev presentation
├── global-bottom.vue    # Global Slidev component
├── index.ts             # Main addon entry point
├── vite.config.ts       # Vite configuration with Inalia env injection
├── tsdown.config.ts     # Build configuration
├── eslint.config.mjs    # ESLint configuration
└── package.json         # Dependencies and scripts
```

### Important Files for Development
- `index.ts` - Main export file, exports all components, composables, and types
- `setup/main.ts` - Slidev app setup, handles WebSocket connections and API integration
- `vite.config.ts` - Injects ~/.inaliarc configuration as VITE_ env vars
- `slides.md` - Example presentation for testing components
- `components/Inalia.vue` - Main component for interactive questions and charts

### Build Artifacts (do not edit)
- `dist/index.js` and `dist/index.d.ts` - Generated addon distribution files
- `dist/` (after `pnpm run build`) - Static presentation build

## Common Development Tasks

### Adding New Components
1. Create new Vue component in `components/`
2. Export in `index.ts`
3. Add TypeScript types in `types/` if needed
4. Test in `slides.md`
5. Run `pnpm run lint:fix` before committing

### Modifying API Integration
- Edit `utils/api.ts` for API calls
- Update `setup/main.ts` for WebSocket setup
- Check `vite-env.d.ts` for environment variable types
- Test both static mode and full API mode

### Working with Charts and Visualizations
- Chart components in `components/InaliaChart*.vue`
- Uses @unovis libraries for data visualization
- Test with different chart types: donut, bar

### WebSocket and Real-time Features
- Laravel Echo + Pusher.js setup in `setup/main.ts`
- Channel utilities in `utils/channels.ts`
- Event handling in `utils/events.ts`
- Live reactions in `components/InaliaLiveReactions.vue`

## Timing Expectations

- **NEVER CANCEL** builds or commands. Set appropriate timeouts:
  - `pnpm install`: 60+ seconds timeout
  - `pnpm run prepack`: 30+ seconds timeout
  - `pnpm run build`: 60+ seconds timeout
  - `pnpm run lint`: 30+ seconds timeout

## Common Commands Reference
```bash
# Environment setup
corepack enable
pnpm install

# Development
pnpm run dev                # Start development server
pnpm run build              # Build static presentation
pnpm run prepack            # Build addon for distribution
pnpm run lint               # Lint code
pnpm run lint:fix           # Auto-fix linting issues

# Release (maintainers only)
pnpm run release            # Create new version with bumpp
```

## Troubleshooting

### Build Issues
- Ensure all dependencies installed: `pnpm install`
- Check TypeScript errors: `pnpm run prepack`
- Verify environment variables in `.env` if using API features

### Development Server Issues
- Check port 3030 is available
- Verify slides.md syntax is valid
- In static mode, expect "Inalia is running in static mode" warning

### Linting Failures
- Run `pnpm run lint:fix` to auto-fix most issues
- Check .vscode/settings.json for IDE configuration
- Ensure @antfu/eslint-config rules are followed

**Remember**: Always validate your changes by running the dev server and testing at least one complete slide presentation scenario.
