 function loadPage(page) {
    document.getElementById('mainFrame').src = page;
  }

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      loadPage(page);
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    logoutUser();
  });