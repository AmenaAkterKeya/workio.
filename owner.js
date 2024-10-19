document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem("user_id");
    const customuser_id = localStorage.getItem("customuser_id");

 
    if (user_id) {
        fetch(`https://workio-theta.vercel.app/account/user/${customuser_id}/`)
            .then(response => response.json())
            .then(data => {
                console.log(data); 

                if (data && data.user) { 
                    const user = data.user; 
                    const bio = data.bio || "";

                    document.getElementById("user-name").textContent = `${user.first_name} ${user.last_name}`;
                    document.getElementById("user-email").textContent = user.email;
                    document.getElementById("username").value = `${user.username}`;
                    document.getElementById("bio").value = bio;
                } else {
                    console.error('Unexpected response structure:', data);
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
    } else {
        console.error('No user_id found');
    }

    const saveButton = document.getElementById('save-btn');
    const alertBox = document.getElementById('error');

    saveButton.addEventListener('click', function() {
        
        const username = document.getElementById('username').value;
        const bio = document.getElementById('bio').value;
        const token = localStorage.getItem("token");
        const [first_name, last_name] = username.split(' '); 

        const data = {
            first_name: first_name || '', 
            last_name: last_name || '',  
            bio: bio
        };

    
        fetch(`https://workio-theta.vercel.app/account/user/${customuser_id}/`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // show success message in the alert box
            alertBox.textContent = "Your information saved successfully!";
            alertBox.style.display = "block";
            alertBox.classList.remove('alert-danger');
            alertBox.classList.add('alert-info');

            // Hide the alert box 
            setTimeout(() => {
                alertBox.style.display = "none";
            }, 3000);
        })
        .catch((error) => {
            // alert box
            console.error('Error:', error);
            alertBox.textContent = "Failed to save your information.";
            alertBox.style.display = "block";
            alertBox.classList.remove('alert-info');
            alertBox.classList.add('alert-danger');

            // Hide the alert box after a few seconds
            setTimeout(() => {
                alertBox.style.display = "none";
            }, 3000);
        });
    });
});
