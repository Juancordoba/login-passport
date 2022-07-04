import React from 'react';
import './App.css';
import GoogleLogin from 'react-google-login';

function App() {
  
  const handleLogin = async (googleData:any) => {
    const res = await fetch("https://localhost:5000/api/v1/auth/google", {
        method: "POST",
        body: JSON.stringify({
        token: googleData.tokenId
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await res.json()
    console.log(data)
    // store returned user somehow
  }

  return (
    <div className="App">
      <GoogleLogin
          clientId={`1011173325878-1i8v650l8a789d6nsb5hrqhe6f0btvge.apps.googleusercontent.com`}
          buttonText="Log in with Google"
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={'single_host_origin'}
      />
    </div>
  );
}

export default App;
