const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  const cmd = 'djangoDRF.scaffoldProject';
  const disposable = vscode.commands.registerCommand(cmd, async () => {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
      return vscode.window.showErrorMessage('Open a folder first to scaffold the project.');
    }
    const target = folders[0].uri.fsPath;
    const templateRoot = path.join(__dirname, 'templates');

    try {
      copyTemplates(templateRoot, target, ['.git', '.vsix', 'venv', '.vscode']);
      vscode.window.showInformationMessage('Django DRF template scaffolded successfully.');
    } catch (err) {
      vscode.window.showErrorMessage(`Scaffold failed: ${err.message}`);
    }
  });

  context.subscriptions.push(disposable);
}

function copyTemplates(src, dest, ignoreList = []) {
  if (!fs.existsSync(src)) throw new Error('Templates folder missing in extension package.');
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const ent of entries) {
    if (ignoreList.includes(ent.name)) continue;
    const srcPath = path.join(src, ent.name);
    const destPath = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      copyTemplates(srcPath, destPath, ignoreList);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
