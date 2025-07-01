// Replace with actual user ID (from session or auth)
    //const userId = document.getElementById('userId').value;

    async function loadCurrentUser() {
      try {
       // const res = await fetch(`/api/users/${userId}`);
       // const user = await res.json();
        const res = await fetch(`/api/users/me`);
      if (!res.ok) throw new Error('Not logged in');

      const user = await res.json();
      window.currentUserId = user.id;
        document.getElementById('username').value = user.username;
      } catch (err) {
        console.error('Failed to load user:', err);
         document.getElementById('message').innerHTML = `<div class="alert alert-danger">Please log in to access your profile.</div>`;
      }
    }

    document.getElementById('profileForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = this.username.value;
      const password = this.password.value;

      const data = { username };
      if (password.trim()) data.password = password;

      try {
        const res = await fetch(`/api/users/${window.currentUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        document.getElementById('message').innerHTML = `<div class="alert alert-success">${result.message || 'Profile updated'}</div>`;
        this.password.value = ''; // Clear password field
      } catch (err) {
        console.error(err);
        document.getElementById('message').innerHTML = `<div class="alert alert-danger">Update failed</div>`;
      }
    });

    loadCurrentUser();