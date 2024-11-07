(async () => {
    const fetch = await import('node-fetch').then(mod => mod.default);
  
    const testLogin = async () => {
      const url = 'http://localhost:3000/AdminLogin';
      const data = {
        username: 'yourUsername',
        password: 'yourPassword'
      };
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log('Login successful:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    testLogin();
  })();
  