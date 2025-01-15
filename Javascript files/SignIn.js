// Handle Sign Up
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message); // Display success message
      // Redirect to Site Setups page
      window.location.href = '/SiteSetups.html';
    } else {
      alert(data.message); // Display error message from server
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while signing up.');
  }
});

// Handle Sign In
document.getElementById('signin-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;

  try {
    const response = await fetch('/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message); // Display success message
      // Redirect to Site Setups page
      window.location.href = '/SiteSetups.html';
    } else {
      alert(data.message); // Display error message from server
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while signing in.');
  }
});




document.addEventListener('DOMContentLoaded', async () => {
  const logoutButton = document.getElementById('logout-btn');

  // Check if the authToken cookie exists and validate it
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));

  if (token) {
    // Optionally validate the token with the server
    try {
      const response = await fetch('/validate-token', { credentials: 'include' });

      if (response.ok) {
        // Token is valid, show the logout button
        logoutButton.style.display = 'inline-block';
      } else {
        console.log('Invalid token, hiding logout button.');
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } catch (error) {
      console.error('Error validating token:', error);
    }
  } else {
    console.log('No authToken cookie found.');
  }
});

// Handle Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      credentials: 'include', // Ensure cookies are included in the request
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message); // Display success message
      // Redirect to Sign-In page
      window.location.href = '/SignIn.html';
    } else {
      alert('Logout failed.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during logout.');
  }
});
