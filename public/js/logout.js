
  function logoutUser() {
    fetch("/api/auth/logout", {
      method: 'POST',
      credentials: 'include' // ensure cookies/session are sent
    })
    .then(res => {
      if (res.ok) {
        window.location.href = '/'; // redirect to login page
      } else {
        alert('Logout failed');
      }
    })
    .catch(err => {
      console.error('Logout error:', err);
      alert('An error occurred while logging out.');
    });
  }

