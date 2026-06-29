import { getCurrentUser, removeCurrentUser } from "./user.js";

const cUser = await getCurrentUser()
const currentPage = window.location.pathname.split('/').pop() || 'index.html'
const protectedPages = ['feed.html', 'post.html', 'friends.html', 'profile.html', 'viewProfile.html']
const publicPages = ['login.html', 'register.html']
let nav = document.querySelector('nav')

if (protectedPages.includes(currentPage) && !cUser) {
  window.location.replace('/')
}

if (publicPages.includes(currentPage) && cUser) {
  window.location.replace('feed.html')
}

if(cUser) {
    nav.innerHTML = `
       <ul>
        <li><a href="feed.html">Feed</a></li>
        <li><a href="post.html">Post</a></li>
        <li><a href="friends.html">Friends</a></li>
        <li><a href="profile.html">Profile</a></li>
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
  const response = await fetch(`http://localhost:3500${route}`, {
    method: methodType,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw await response.json();
  }
}