# Droid + Ralphy Setup

This document explains the Ralphy v4.0.0 setup with Droid (GLM 4.7) support in ChatVault.

## Overview

ChatVault uses **Ralphy v4.0.0** - an autonomous AI coding loop that can work through tasks sequentially or in parallel. It's configured to use **Droid** (Factory Droid CLI) as the AI engine with **GLM 4.7**.

## Setup Details

### Files Added/Modified

1. **`ralphy.sh`** (v4.0.0) - Updated from ralphy repository
   - Supports multiple AI engines: Claude, OpenCode, Cursor, Codex, Qwen-Code, and **Droid**
   - Brownfield mode for single-task execution
   - .ralphy/ configuration system
   - Parallel execution with isolated git worktrees

2. **`.ralphy/config.yaml`** - Auto-generated configuration
   - Auto-detected: TypeScript, React (Vite)
   - Project name: `chatvault`
   - Build command: `npm run build`
   - Rules: Array of AI instructions (empty by default)
   - Boundaries: Files/folders the AI should not modify

3. **`.ralphy/progress.txt`** - Progress log
   - Tracks completed/failed tasks with timestamps

### Smart Detection

The `--init` command automatically detected:
- **Language**: TypeScript (updated from JavaScript)
- **Framework**: React (Vite)
- **Project name**: ChatVault (from package.json)
- **Build command**: `npm run build`

### AI Engine Configuration

**Droid** is already configured globally with:
- GLM 4.7 API key
- Factory CLI version 0.53.0
- Available via the `droid` command

No additional API key setup needed - Droid uses your existing configuration.

## Usage

### PowerShell Commands

Run Ralphy with Droid:
```powershell
& "C:\Program Files\Git\bin\bash.exe" -c "cd C:\Users\bills\Documents\Personal Projects\ChatVault && bash ralphy.sh --droid"
```

Single task mode:
```powershell
& "C:\Program Files\Git\bin\bash.exe" -c "cd C:\Users\bills\Documents\Personal Projects\ChatVault && bash ralphy.sh 'your task description' --droid"
```

Fast mode (skip tests & linting):
```powershell
& "C:\Program Files\Git\bin\bash.exe" -c "cd C:\Users\bills\Documents\Personal Projects\ChatVault && bash ralphy.sh --droid --fast"
```

Parallel execution:
```powershell
& "C:\Program Files\Git\bin\bash.exe" -c "cd C:\Users\bills\Documents\Personal Projects\ChatVault && bash ralphy.sh --droid --parallel --max-parallel 4"
```

### Git Bash Commands

```bash
cd "C:\Users\bills\Documents\Personal Projects\ChatVault"
bash ralphy.sh --droid
```

## PRD Mode vs Brownfield Mode

### PRD Mode (Task Lists)
Uses `PRD.md` file with tasks marked as `- [ ] Task description`:
```bash
bash ralphy.sh --droid
```
Ralphy will work through all incomplete tasks sequentially.

### Brownfield Mode (Single Tasks)
Run a single task without a PRD:
```bash
bash ralphy.sh "add dark mode toggle" --droid
```

## Configuration Management

### View Current Config
```powershell
& "C:\Program Files\Git\bin\bash.exe" -c "cd C:\Users\bills\Documents\Personal Projects\ChatVault && bash ralphy.sh --config"
```

### Add Rules (AI Instructions)
Rules are injected into every prompt:
```powershell
& "C:\Program Files\Git\bin\bash.exe" -c "cd C:\Users\bills\Documents\Personal Projects\ChatVault && bash ralphy.sh --add-rule 'Always use TypeScript strict mode'"
```

### Boundaries (Files to Avoid)
Edit `.ralphy/config.yaml` directly:
```yaml
boundaries:
  never_touch:
    - "node_modules/**"
    - "dist/**"
```

## Key Features

### Parallel Execution
Each agent runs in an isolated git worktree:
```bash
bash ralphy.sh --droid --parallel --max-parallel 3
```

### Branch-Per-Task
Create a branch for each task:
```bash
bash ralphy.sh --droid --branch-per-task --create-pr --draft-pr
```

### YAML Task Files
Use YAML for complex task management:
```yaml
tasks:
  - title: Add dark mode
    completed: false
    parallel_group: 1
```

## Available AI Engines

```bash
bash ralphy.sh --claude      # Claude Code (default)
bash ralphy.sh --opencode    # OpenCode
bash ralphy.sh --cursor      # Cursor agent
bash ralphy.sh --codex       # Codex CLI
bash ralphy.sh --qwen       # Qwen-Code
bash ralphy.sh --droid      # Factory Droid (GLM 4.7)
```

## Project Details

**Stack:**
- React 19.2.3
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS
- Supabase
- Zustand (state management)

**Current Status:**
- 51 tasks completed
- 291 tasks remaining

## Troubleshooting

### Ralphy Exits Immediately
```bash
sed -i 's/\r$//' ralphy.sh
```

### Git Bash Not Found
Always use the full path:
```powershell
& "C:\Program Files\Git\bin\bash.exe" -c "bash ralphy.sh --droid"
```

## Resources

- [Ralphy GitHub](https://github.com/michaelshimeles/ralphy)
- [Droid Documentation](https://docs.factory.ai)
- [GLM 4.7 Model](https://opencode.ai/docs/models)

## Notes for New Agents

1. **Version**: Ralphy v4.0.0 (brownfield v2)
2. **Engine**: Droid with GLM 4.7
3. **Project**: ChatVault (Vite + React + TypeScript)
4. **Framework**: React with Vite
5. **Language**: TypeScript
6. **Config**: `.ralphy/config.yaml` always present
7. **Progress**: Logged in `.ralphy/progress.txt`

When taking over this project, simply run:
```powershell
& "C:\Program Files\Git\bin\bash.exe" -c "cd C:\Users\bills\Documents\Personal Projects\ChatVault && bash ralphy.sh --config"
```

To understand the current configuration and rules.
