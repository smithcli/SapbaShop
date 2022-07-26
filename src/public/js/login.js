const login = async (email, password) => {
  try {
    const res = await fetch('http://localhost:8000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((response) => response.json());
    console.log(res)
    if (res.status === 'success') {
      location.assign('/dashboard');
    } else {
      throw new Error(res.message)
    }
  } catch (err) {
    alert(err.message)
  }
};

document.querySelector('.form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
