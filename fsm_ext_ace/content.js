chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openAceEditor') {
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const initialText = activeElement.value;
  
        // Create a container for the buttons and the Ace Editor
        const editorContainer = document.createElement('div');
        editorContainer.style.display = 'flex';
        editorContainer.style.flexDirection = 'column';
        editorContainer.style.width = '100%';
  
        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginBottom = '10px';
  
        // Create the "Indent" button
        const indentButton = document.createElement('button');
        indentButton.textContent = 'Indenter';
        indentButton.style.marginRight = '10px';
  
        // Create the "Test Code" button
        const testButton = document.createElement('button');
        testButton.textContent = 'Tester le code';
  
        buttonContainer.appendChild(indentButton);
        buttonContainer.appendChild(testButton);
  
        // Create a container for the Ace Editor
        const aceContainer = document.createElement('div');
        aceContainer.id = 'aceEditor';
        aceContainer.style.width = '100%';
        aceContainer.style.height = '400px';
        aceContainer.style.border = '1px solid #ccc';
  
        // Create a container for the console output
        const consoleContainer = document.createElement('div');
        consoleContainer.className = 'console-container';
        consoleContainer.style.border = '1px solid #ccc';
        consoleContainer.style.backgroundColor = '#f9f9f9';
        consoleContainer.style.padding = '10px';
        consoleContainer.style.marginTop = '10px';
        consoleContainer.style.maxHeight = '200px';
        consoleContainer.style.overflowY = 'auto';
  
        editorContainer.appendChild(buttonContainer);
        editorContainer.appendChild(aceContainer);
        editorContainer.appendChild(consoleContainer);
  
        activeElement.style.display = 'none'; // Hide the original text field
        activeElement.parentNode.insertBefore(editorContainer, activeElement);
  
        // Initialize the Ace Editor
        const editor = ace.edit('aceEditor');
        editor.setTheme('ace/theme/monokai');
        editor.session.setMode('ace/mode/javascript');
        editor.setValue(initialText, -1);
  
        // Now set the event listeners for the buttons
        indentButton.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          editor.session.setValue(js_beautify(editor.getValue(), { indent_size: 2 }));
        };
  
        testButton.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
  
          // Clear the console output
          consoleContainer.innerHTML = '';
  
          // Create a Web Worker
          const worker = new Worker(chrome.runtime.getURL('worker.js'));
  
          worker.onmessage = function(event) {
            const message = document.createElement('div');
            if (event.data.type === 'success') {
              message.textContent = 'Result: ' + event.data.result;
              consoleContainer.appendChild(message);
            } else if (event.data.type === 'error') {
              message.style.color = 'red';
              message.textContent = 'Erreur : ' + event.data.error;
              consoleContainer.appendChild(message);
            }
            // Terminate the worker after execution
            worker.terminate();
          };
  
          worker.postMessage(editor.getValue());
        };
      } else {
        console.log('Aucun champ de texte sélectionné.');
      }
    }
  });
  