self.onmessage = function(event) {
    const code = event.data;
  
    try {
      const result = new Function(code)();
      postMessage({ type: 'success', result: result });
    } catch (error) {
      postMessage({ type: 'error', error: error.message });
    }
  };
  