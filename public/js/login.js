// /public/js/login.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorEl = document.getElementById("error");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
  
      // Collect and sanitize inputs
      const username = form.username.value.trim();
      const password = form.password.value;
  
      if (!username || !password) {
        errorEl.textContent = "Both username and password are required.";
        return;
      }
  
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          // Redirect on success
         // window.location.href = "/";
         console.log(data.role)

if (data.role === 'admin') {
    window.location.href = "./adminDisplay.html";
  } else {
    window.location.href = "./userDisplay.html";
  }

        } else {
          // Show server-side error
          errorEl.textContent = data.message || "Login failed.";
        }
      } catch (err) {
        console.error("Login error:", err);
        errorEl.textContent =
          "An unexpected error occurred. Please try again.";
      }
    });
  });
  