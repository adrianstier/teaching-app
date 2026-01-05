#!/usr/bin/env node
import { WorkflowCoordinator } from './workflow/coordinator';
import chalk from 'chalk';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

async function checkConfiguration(): Promise<boolean> {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.log(chalk.red('\n❌ OpenAI API key not found!'));
    console.log(chalk.yellow('Please configure your API key:'));
    console.log(chalk.gray('1. Create a .env file in the project root'));
    console.log(chalk.gray('2. Add: OPENAI_API_KEY=your_api_key_here'));
    console.log(chalk.gray('\nExample .env file provided in .env.example\n'));

    const { configure } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'configure',
        message: 'Would you like to enter your API key now?',
        default: false
      }
    ]);

    if (configure) {
      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your OpenAI API key:',
          mask: '*',
          validate: (input) => input.length > 0 || 'API key is required'
        }
      ]);

      // Save to .env file
      const envContent = `# OpenAI API Configuration
OPENAI_API_KEY=${apiKey}

# Optional: Model Configuration
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.7`;

      fs.writeFileSync('.env', envContent);
      console.log(chalk.green('✅ API key saved to .env file'));

      // Reload environment variables
      dotenv.config({ override: true });
      return true;
    }

    return false;
  }

  return true;
}

async function displayWelcome(): Promise<void> {
  console.clear();
  console.log(chalk.blue.bold('\n' + '═'.repeat(70)));
  console.log(chalk.blue.bold('                    🎓 LECTURE DEVELOPMENT SYSTEM'));
  console.log(chalk.blue.bold('               Automated Multi-Agent Content Creation'));
  console.log(chalk.blue.bold('═'.repeat(70) + '\n'));

  console.log(chalk.white('Welcome to the Automated Lecture Development System!'));
  console.log(chalk.gray('\nThis system will guide you through creating a complete lecture package'));
  console.log(chalk.gray('using specialized AI agents for each phase of development.\n'));

  console.log(chalk.cyan('System Capabilities:'));
  console.log('  📋 Structured intake interview');
  console.log('  🎯 Learning objective design');
  console.log('  🗺️  Concept mapping and structure planning');
  console.log('  ✍️  Content development and example creation');
  console.log('  💡 Interactive activity design');
  console.log('  🎨 Visual presentation planning');
  console.log('  📦 Complete package assembly\n');
}

async function getStartOptions(): Promise<string> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🚀 Create a new lecture', value: 'new' },
        { name: '📖 View documentation', value: 'docs' },
        { name: '⚙️  Configure settings', value: 'settings' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }
  ]);

  return action;
}

async function displayDocumentation(): Promise<void> {
  console.log(chalk.cyan.bold('\n📖 DOCUMENTATION\n'));

  console.log(chalk.yellow('System Overview:'));
  console.log('The system uses specialized AI agents working in phases:\n');

  console.log(chalk.white('Phase 1: INTAKE'));
  console.log('  - Orchestrator Agent conducts structured interview');
  console.log('  - Generates comprehensive lecture brief\n');

  console.log(chalk.white('Phase 2: ARCHITECTURE'));
  console.log('  - Curriculum Architect designs learning objectives');
  console.log('  - Creates concept map and lecture structure\n');

  console.log(chalk.white('Phase 3: PARALLEL DEVELOPMENT'));
  console.log('  - Content Developer creates segment content');
  console.log('  - Pedagogy Designer creates activities\n');

  console.log(chalk.white('Phase 4: VISUAL DESIGN'));
  console.log('  - Visual Designer creates slide specifications\n');

  console.log(chalk.white('Phase 5: INTEGRATION'));
  console.log('  - Integration Agent assembles final package');
  console.log('  - Generates instructor guide and materials\n');

  console.log(chalk.gray('Press any key to continue...'));
  await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);
}

async function displaySettings(): Promise<void> {
  console.log(chalk.cyan.bold('\n⚙️  SETTINGS\n'));

  console.log(chalk.white('Current Configuration:'));
  console.log(`  Model: ${process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'}`);
  console.log(`  Temperature: ${process.env.TEMPERATURE || '0.7'}`);
  console.log(`  API Key: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Not set'}\n`);

  const { modify } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'modify',
      message: 'Would you like to modify settings?',
      default: false
    }
  ]);

  if (modify) {
    console.log(chalk.yellow('\nPlease edit the .env file directly to modify settings.'));
    console.log(chalk.gray('Settings will be applied on next run.\n'));
  }
}

async function main(): Promise<void> {
  try {
    // Check configuration
    const configured = await checkConfiguration();
    if (!configured) {
      console.log(chalk.red('\n❌ Configuration incomplete. Exiting.'));
      process.exit(1);
    }

    // Main loop
    let running = true;
    while (running) {
      await displayWelcome();
      const action = await getStartOptions();

      switch (action) {
        case 'new':
          console.log(chalk.green('\n🚀 Starting lecture development process...\n'));
          const coordinator = new WorkflowCoordinator();

          try {
            const lecturePackage = await coordinator.execute();
            console.log(chalk.green.bold('\n✅ SUCCESS!'));
            console.log(chalk.white(`Lecture "${lecturePackage.brief.title}" has been created.`));
            console.log(chalk.gray('Check the output folder for all generated materials.\n'));
          } catch (error) {
            console.error(chalk.red('\n❌ Error during execution:'), error);
          }

          const { another } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'another',
              message: 'Would you like to create another lecture?',
              default: false
            }
          ]);

          if (!another) {
            running = false;
          }
          break;

        case 'docs':
          await displayDocumentation();
          break;

        case 'settings':
          await displaySettings();
          break;

        case 'exit':
          running = false;
          break;
      }
    }

    console.log(chalk.blue('\n👋 Thank you for using the Lecture Development System!\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Fatal error:'), error);
    process.exit(1);
  }
}

// Run the application
if (require.main === module) {
  main().catch(console.error);
}

export { main };