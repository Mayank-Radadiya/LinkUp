import React from "react";

function Login() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries()); // Converts formData to a plain object

    try {
     const response = await fetch("http://localhost:3001/auth/login", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(data),
        credentials: "include", // This ensures cookies are sent with the request
      });

      if (response.status === 200) {
        console.log("Login successful");
        // Handle successful login (e.g., redirect or show success message)
      } else {
        console.error("Login failed");
        // Handle login failure (e.g., show error message)
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <div>
      <div>
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="emailOrUsername"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />

            <button type="submit">Login</button>
          </form>
        </>
      </div>
    </div>
  );
}

export default Login;
