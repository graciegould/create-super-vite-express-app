#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cp = require('console-palette');
const readline = require('readline');
const REPO_URL = 'https://github.com/graciegould/super-vite-express-app';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const checkExistingNodeProject = (projectPath) => {
  return fs.existsSync(path.join(projectPath, 'package.json'));
};
const isDirectoryNotEmpty = (directoryPath) => {
  return fs.existsSync(directoryPath) && fs.readdirSync(directoryPath).length > 0;
};
const promptUser = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase());
    });
  });
};
const startSpinner = (message) => {
  const spinnerChars = ['|', '/', '-', '\\'];
  let i = 0;

  const interval = setInterval(() => {
    process.stdout.write('\r' + message + spinnerChars[i++ % spinnerChars.length] + ' ');
  }, 100);

  return () => {
    clearInterval(interval);
    process.stdout.write('\r' + message + '✔\n');
  };
};
const clearDirectory = (directoryPath) => {
  fs.readdirSync(directoryPath).forEach(file => {
    const filePath = path.join(directoryPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  });
};
const updatePackageJson = (projectPath, projectName) => {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log(cp.green(`Project name updated to ${cp.cyan(projectName)} in package.json`));
  }
};

let projectName = process.argv[2] || '.';
let projectPath = '';

if (projectName === '.') {
  projectPath = process.cwd();
  projectName = path.basename(projectPath);
} else {
  projectPath = path.resolve(process.cwd(), projectName);
}

(async () => {
  try {
    if (fs.existsSync(projectPath)) {
      if (checkExistingNodeProject(projectPath)) {
        const overwriteProject = await promptUser(cp.yellow(
          `Directory ${projectPath} contains an existing Node.js project. Overwrite? (y/n): `
        ));

        if (overwriteProject !== 'y') {
          console.log(cp.red('Project creation aborted.'));
          process.exit(0);
        }
      } else if (isDirectoryNotEmpty(projectPath)) {
        const overwriteContents = await promptUser(cp.yellow(
          `Directory ${projectPath} is not empty. Overwrite contents? (y/n): `
        ));

        if (overwriteContents !== 'y') {
          console.log(cp.red('Project creation aborted.'));
          process.exit(0);
        }
        const stopClearSpinner = startSpinner(`Clearing directory contents of ${projectPath}...`);
        clearDirectory(projectPath);
        stopClearSpinner();
      }
    } else {
      fs.mkdirSync(projectPath, { recursive: true });
    }
    const stopCloneSpinner = startSpinner(cp.brightMagenta(`Cloning repository into ${projectPath}...`));
    execSync(`git clone ${REPO_URL} "${projectPath}" --depth 1`);
    stopCloneSpinner();

    // Clear Git history (remove .git folder)
    const gitPath = path.join(projectPath, '.git');
    if (fs.existsSync(gitPath)) {
      const stopGitSpinner = startSpinner(cp.blue(`Clearing Git history...`));
      fs.rmSync(gitPath, { recursive: true, force: true });
      stopGitSpinner();
      console.log(cp.green('Git history cleared.'));
    }

    // Update package.json with the new project name
    updatePackageJson(projectPath, projectName);

    // Ensure the package.json exists before running npm install
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error(cp.red(`Error: package.json not found in ${projectPath}. Aborting npm install.`));
      process.exit(1);
    }

    process.chdir(projectPath);

    const stopInstallSpinner = startSpinner(cp.cyan('Installing dependencies...'));
    execSync('npm install', { stdio: 'inherit' });
    stopInstallSpinner();

    console.log(cp.brightGreen('\nSetup complete! To get started:'));
    console.log(cp.custom(`  cd ${projectName}`, { color: "yellow", style: "bold" }));
    console.log(cp.custom('  npm start', { color: "yellow", style: "bold" }));
    console.log(cp.blue('For more information, check out the README.md file.'));

  } catch (error) {
    console.error(cp.red(`An error occurred: ${error.message}`));
    process.exit(1);
  } finally {
    rl.close();
  }
})();
