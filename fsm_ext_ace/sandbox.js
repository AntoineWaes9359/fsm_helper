(function() {
    // Redirect console.log and console.error to the parent document
    window.console.log = function(...args) {
      parent.postMessage({ type: 'log', message: args.join(' ') }, '*');
    };
  
    window.console.error = function(...args) {
      parent.postMessage({ type: 'error', message: args.join(' ') }, '*');
    };
  
    // Function to run the user code
    window.runUserCode = function(userCode) {
      try {
        new Function(userCode)();
        parent.postMessage({ type: 'success', message: 'Code exécuté sans erreur.' }, '*');
      } catch (e) {
        parent.postMessage({ type: 'error', message: 'Erreur dans le code : ' + e.message }, '*');
      }
    };
  
    // Listen for messages from the parent document
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'runCode') {
        runUserCode(event.data.code);
      }
    });
  })();
  