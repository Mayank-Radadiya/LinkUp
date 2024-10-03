// import React from "react";

// function register() {
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);

//     try {
//       const response = await fetch("http://localhost:3001/auth/register", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.status === 200) {
//         console.log("Registration successful");
//         // Handle successful registration (e.g., redirect or show success message)
//       } else {
//         console.error("Registration failed");
//         // Handle registration failure (e.g., show error message)
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       // Handle network errors or other exceptions
//     }
//   };
//   return (
//     <div>
//       return{" "}
//       <>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="firstName"
//             placeholder="First Name"
//             required
//           />
//           <input type="text" name="lastName" placeholder="Last Name" required />
//           <input type="email" name="email" placeholder="Email" required />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//           <input type="text" name="username" placeholder="Username" required />
//           <input type="file" name="picturePath" accept="image/*" />
//           <input type="text" name="friends" placeholder="Friends" />
//           <input type="text" name="location" placeholder="Location" />
//           <input type="text" name="occupation" placeholder="Occupation" />
//           <button type="submit">Register</button>
//         </form>
//       </>
//     </div>
//   );
// }

// export default register;
