// Define getValue function first
const getValue = (id) => {
    const value = document.getElementById(id).value;
    return value;
};

// Then define handleRegistration function
const handleRegistration = (event) => {
    event.preventDefault();

    const username = getValue("username");
    const first_name = getValue("first_name");
    const last_name = getValue("last_name");
    const email = getValue("email");
    const password = getValue("password");
    const confirm_password = getValue("confirm_password");
    
    const info = {
        username,
        first_name,
        last_name,
        email,
        password,
        confirm_password
    };
    
    const preloader = document.getElementById("preloader");
    const errorElement = document.getElementById("error");
    
    if (password === confirm_password) {
        preloader.style.display = "flex";
        errorElement.innerText = "";
        
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
            fetch("https://workio-ypph.onrender.com/account/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info),
            })
            .then((res) => res.json())
            .then((data) => {
                preloader.style.display = "none";
                alert("Verify Your Email Account");
                window.location.href = "logIn.html";
            });
        } else {
            errorElement.innerText =
                "Password must contain eight characters, at least one letter, one number, and one special character.";
        }
    } else {
        errorElement.innerText = "Password and confirm password do not match";
    }
};

  
const handleLogin =  (event) => {
    event.preventDefault();

    // Get username and password 
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const preloader = document.getElementById("preloader");
    const errorElement = document.getElementById("error");

    errorElement.style.display = "none"; 

    if (username && password) {
        preloader.style.display = "flex"; // Show preloader

        fetch("https://workio-ypph.onrender.com/account/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
         
        .then((res) => res.json())
        .then(async (data) => {
            console.log("data",data)
            if (data.token && data.user_id && data.customuser_id) {
                await localStorage.setItem("token", data.token);
                await localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("customuser_id", data.customuser_id)
               
               
                const customuser_id = localStorage.getItem("customuser_id")
                // console.log(customuser_id)
                if (customuser_id) {
                    setTimeout(() => {
                        window.location.href = "profile.html";
                    }, 100);
                }
                  
            } else {
                
                errorElement.innerText = data.error || "An unknown error occurred. Please try again.";
                errorElement.style.display = "block";
            }
           
        })
        .catch((error) => {
            console.error("Login Error:", error);
            errorElement.innerText = "An error occurred. Please try again later.";
            errorElement.style.display = "block";
        });
    } else {
        errorElement.innerText = "Username and password are required.";
        errorElement.style.display = "block";
    }
};

  
const handlelogOut = (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem("token");
  
    fetch("https://workio-ypph.onrender.com/account/logout/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("customuser_id");
        window.location.href = "./index.html";
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  
    