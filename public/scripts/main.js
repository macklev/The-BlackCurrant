import { getCurrentUser, removeCurrentUser } from "./user.js";

let cUser = await getCurrentUser()
let nav = document.querySelector('nav')

if(cUser) {
    nav.innerHTML = `
       <ul>
         <li><a href="post.html">Post</a></li>
         <li><a id="logout" href="#">Logout</a></li>
        </ul>
    `
} else {
    nav.innerHTML = `
         <ul>
           <li><a href="login.html">Login</a></li>
           <li><a href="register.html">Register</a></li>
         </ul>
    `
}

let logout = document.getElementById("logout")
if(logout) logout.addEventListener('click', removeCurrentUser)


export async function fetchData(route = '', data = {}, methodType) {
  const response = await fetch(`http://localhost:3000${route}`, {
    method: methodType, // *POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  if (response.ok) {
    return await response.json(); // parses JSON response into native JavaScript objects
  } else {
    throw await response.json();
  }
}