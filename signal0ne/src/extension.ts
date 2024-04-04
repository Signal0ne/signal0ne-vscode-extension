// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('signal0ne.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Signal0ne!');
	});
	let codeContextDisposable = vscode.commands.registerCommand('signal0ne.addCodeAsContext', () => {
		let editor = vscode.window.activeTextEditor;
		let selection = editor?.selection;
		let codeSnippet = editor?.document.getText(selection);
		let lang = editor?.document.languageId;
		let codeSnippetContext = {
			code: codeSnippet,
			lang: lang
		}
		axios.post('http://localhost:8080/api/issues/d732e352-7bd6-4e77-987e-f52bf385f71d/add-code-as-context', codeSnippetContext)
		.then((response: any) => {
			console.log(response);
			editor?.edit((editBuilder) => {
				editBuilder.replace(selection ?? new vscode.Selection(0, 0, 0, 0), response.data.newCode);
			})
		});
	});

	context.subscriptions.push(codeContextDisposable);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}