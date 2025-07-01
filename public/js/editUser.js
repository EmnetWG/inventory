
    const apiBase = '/api/users';
  const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));

  async function fetchAndPopulate() {
    try {
      const res = await fetch(apiBase);
      const users = await res.json();

      const tbody = document.querySelector('#usersTable tbody');
      tbody.innerHTML = '';

      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.username}</td>
          <td><span class="badge ${user.role === 'Admin' ? 'bg-danger' : 'bg-secondary'}">${user.role}</span></td>
          <td>
          <button class="btn btn-sm btn-primary" onclick="openEditModal('${user.id}', '${user.username}', '${user.role}')">Edit</button>
           <button class="btn btn-sm btn-secondary" onclick="resetPassword(${user.id})">Reset</button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>

            


          </td>`;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error('Failed to load users', err);
    }
  }

  async function openEditModal(id, username, role) {
    document.getElementById('editUserForm').dataset.userId = id;
    document.getElementById('editEmail').value = username;
    document.getElementById('editRole').value = role;
    editUserModal.show();
  }

  document.getElementById('editUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = this.dataset.userId;
    const role = document.getElementById('editRole').value;
    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error('Update failed');
      editUserModal.hide();
      fetchAndPopulate();
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    }
  });


  async function resetPassword(id) {
  if (!confirm('Are you sure you want to reset this user\'s password to "1234"?')) return;
  try {
    const res = await fetch(`${apiBase}/${id}/resetPassword`, {
      method: 'PATCH', // Or 'PATCH', depending on your API
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: '1234' })
    });

    if (!res.ok) throw new Error('Password reset failed');
    alert('Password reset to 1234');
  } catch (err) {
    console.error(err);
    alert('Failed to reset password');
  }
}

  async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchAndPopulate();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  }

  // Initial load
  fetchAndPopulate();