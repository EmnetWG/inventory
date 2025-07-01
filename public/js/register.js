// /public/js/register.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const errorEl = document.getElementById("error");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
  
      const username = form.username.value.trim();
      const password = form.password.value;
      const confirm = form.confirmPassword.value;
  
      // Basic front‑end validation
      if (!username || !password) {
        errorEl.textContent = "Username and password are required.";
        return;
      }
      if (password !== confirm) {
        errorEl.textContent = "Passwords do not match.";
        return;
      }
  
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          // Optionally auto‑login or redirect to login
          window.location.href = "/login.html";
        } else {
          errorEl.textContent = data.message || "Registration failed.";
        }
      } catch (err) {
        console.error("Registration error:", err);
        errorEl.textContent =
          "An unexpected error occurred. Please try again.";
      }
    });
  });
  