// Theme toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle-btn")
  const html = document.documentElement

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme") || "light"
  html.setAttribute("data-theme", savedTheme)

  // Theme toggle event listener
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    html.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)

    // Add a subtle animation effect
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease"
  })

  // Form validation enhancement
  const forms = document.querySelectorAll(".auth-form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const inputs = form.querySelectorAll("input[required]")
      let isValid = true

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          input.style.borderColor = "#ef4444"
          isValid = false
        } else {
          input.style.borderColor = ""
        }
      })

      // Password confirmation check for signup form
      const password = form.querySelector("#password")
      const confirmPassword = form.querySelector("#confirm_password")

      if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
          confirmPassword.style.borderColor = "#ef4444"
          isValid = false
          e.preventDefault()
          alert("Passwords do not match")
          return
        }
      }

      if (!isValid) {
        e.preventDefault()
        alert("Please fill in all required fields")
      }
    })
  })

  // Input focus enhancement
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "translateY(-2px)"
    })

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = ""
      this.style.borderColor = ""
    })
  })
})
