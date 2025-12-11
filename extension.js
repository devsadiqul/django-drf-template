const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function activate(context) {

  // Register all commands
  registerCommand(context, 'djangoDRF.scaffoldProject', scaffoldProject);
  registerCommand(context, 'djangoDRF.createApp', createDjangoApp);
  registerCommand(context, 'djangoDRF.createSerializer', createSerializer);
  registerCommand(context, 'djangoDRF.createViewset', createViewset);
  registerCommand(context, 'djangoDRF.createApiRoute', createApiRoute);
  registerCommand(context, 'djangoDRF.openDocs', () => {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://www.django-rest-framework.org/'));
  });

  // Sidebar Tree View
  const treeDataProvider = {
    getChildren: () => [
      { label: 'Create Project', command: 'djangoDRF.scaffoldProject' },
      { label: 'Create App', command: 'djangoDRF.createApp' },
      { label: 'Create Serializer', command: 'djangoDRF.createSerializer' },
      { label: 'Create Viewset', command: 'djangoDRF.createViewset' },
      { label: 'Add API Route', command: 'djangoDRF.createApiRoute' },
      { label: 'Open Docs', command: 'djangoDRF.openDocs' }
    ],
    getTreeItem: (item) => {
      const treeItem = new vscode.TreeItem(item.label);
      treeItem.command = { command: item.command, title: item.label };
      return treeItem;
    }
  };

  vscode.window.registerTreeDataProvider('djangoDRF.quickActions', treeDataProvider);
}

/** Helper to register commands */
function registerCommand(context, name, handler) {
  let cmd = vscode.commands.registerCommand(name, handler);
  context.subscriptions.push(cmd);
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

  const gitChoice = await vscode.window.showInformationMessage('Initialize Git?', 'Yes', 'No');
  if (gitChoice === 'Yes') {
    try { cp.execSync('git init', { cwd: targetFolder }); } catch {}
  }

  vscode.window.showInformationMessage(`🎉 Project "${projectName}" created successfully!`);
  const openChoice = await vscode.window.showInformationMessage('Open in new window?', 'Open', 'Stay');
  if (openChoice === 'Open') vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetFolder), true);
}

/** Create Django App */
async function createDjangoApp() {
  const appName = await vscode.window.showInputBox({ placeHolder: 'Enter app name' });
  if (!appName) return;

  const folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const appPath = path.join(folder, appName);

  if (!fs.existsSync(appPath)) fs.mkdirSync(appPath), fs.writeFileSync(path.join(appPath, '__init__.py'), '');
  vscode.window.showInformationMessage(`App "${appName}" created.`);
}

/** Create Serializer */
async function createSerializer() {
  const model = await vscode.window.showInputBox({ placeHolder: 'Model name (User)' });
  if (!model) return;

  const folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const pathToWrite = path.join(folder, 'serializers.py');

  const template = `from rest_framework import serializers\nfrom .models import ${model}\n\nclass ${model}Serializer(serializers.ModelSerializer):\n    class Meta:\n        model = ${model}\n        fields = "__all__"\n`;
  fs.appendFileSync(pathToWrite, template);
  vscode.window.showInformationMessage(`${model}Serializer added.`);
}

/** Create Viewset */
async function createViewset() {
  const model = await vscode.window.showInputBox({ placeHolder: 'Model name (User)' });
  if (!model) return;

  const folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const filePath = path.join(folder, 'views.py');

  const content = `from rest_framework import viewsets\nfrom .models import ${model}\nfrom .serializers import ${model}Serializer\n\nclass ${model}ViewSet(viewsets.ModelViewSet):\n    queryset = ${model}.objects.all()\n    serializer_class = ${model}Serializer\n\n`;
  fs.appendFileSync(filePath, content);
  vscode.window.showInformationMessage(`${model}ViewSet created.`);
}

/** Add API Route */
async function createApiRoute() {
  const route = await vscode.window.showInputBox({ placeHolder: 'Route name (users)' });
  if (!route) return;

  const folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const urlsPath = path.join(folder, 'urls.py');
  const entry = `router.register(r'${route}', ${route.charAt(0).toUpperCase() + route.slice(1)}ViewSet)\n`;
  fs.appendFileSync(urlsPath, entry);
  vscode.window.showInformationMessage(`Route "${route}" added.`);
}

/** Helpers */
function copyTemplates(src, dest, ignoreList = []) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const ent of entries) {
    if (ignoreList.includes(ent.name)) continue;
    const srcPath = path.join(src, ent.name);
    const destPath = path.join(dest, ent.name);
    if (ent.isDirectory()) { if (!fs.existsSync(destPath)) fs.mkdirSync(destPath); copyTemplates(srcPath, destPath, ignoreList); }
    else fs.copyFileSync(srcPath, destPath);
  }
}

function replaceProjectName(dir, projectName) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) replaceProjectName(fullPath, projectName);
    else { let content = fs.readFileSync(fullPath, 'utf8'); fs.writeFileSync(fullPath, content.replace(/{{project_name}}/g, projectName)); }
  }
}

function generateSecretKey() { return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); }

function deactivate() {}

module.exports = { activate, deactivate };
