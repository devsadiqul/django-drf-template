const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function activate(context) {
  // Register only the project scaffold command
  let cmd = vscode.commands.registerCommand('djangoDRF.scaffoldProject', scaffoldProject);
  context.subscriptions.push(cmd);

  // Sidebar Tree View with only "Create Project" as a button
  const treeDataProvider = {
    getChildren: () => [
      { label: 'Create Project', command: 'djangoDRF.scaffoldProject' }
    ],
    getTreeItem: (item) => {
      const treeItem = new vscode.TreeItem(item.label, vscode.TreeItemCollapsibleState.None);
      treeItem.command = { command: item.command, title: item.label };
      treeItem.contextValue = 'button';
      return treeItem;
    }
  };

  vscode.window.registerTreeDataProvider('djangoDRF.quickActions', treeDataProvider);
}

/** Scaffold Project */
async function scaffoldProject() {
  const projectName = await vscode.window.showInputBox({ prompt: 'Enter project name' });
  if (!projectName) return;

  const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true, openLabel: 'Select folder' });
  if (!folderUri) return;

  const targetFolder = path.join(folderUri[0].fsPath, projectName);
  fs.mkdirSync(targetFolder, { recursive: true });

  const templateRoot = path.join(__dirname, 'templates');
  copyTemplates(templateRoot, targetFolder, ['.git', 'venv', '.vscode']);
  replaceProjectName(targetFolder, projectName);

  fs.writeFileSync(path.join(targetFolder, '.env'), `SECRET_KEY=${generateSecretKey()}\nDEBUG=True\nPROJECT_NAME=${projectName}\n`);

  try { cp.execSync('git init', { cwd: targetFolder }); } catch {}

  vscode.window.showInformationMessage(`Project "${projectName}" created successfully!`);
  vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetFolder), true);
}

/** Helpers */
function copyTemplates(src, dest, ignoreList = []) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const ent of entries) {
    if (ignoreList.includes(ent.name)) continue;
    const srcPath = path.join(src, ent.name);
    const destPath = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
      copyTemplates(srcPath, destPath, ignoreList);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function replaceProjectName(dir, projectName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) replaceProjectName(fullPath, projectName);
    else {
      let content = fs.readFileSync(fullPath, 'utf8');
      fs.writeFileSync(fullPath, content.replace(/{{project_name}}/g, projectName));
    }
  }
}

function generateSecretKey() { 
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); 
}

function deactivate() {}

module.exports = { activate, deactivate };