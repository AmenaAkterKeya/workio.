document.addEventListener("DOMContentLoaded", function () {
    const user_id = localStorage.getItem("user_id");
    const customuser_id = localStorage.getItem("customuser_id");
    const alertBox = document.getElementById('error');

    // Fetch user data
    if (user_id) {
        fetch(`https://workio-theta.vercel.app/account/user/${customuser_id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                
                if (data && data.user) {
                    const user = data.user;
                    const bio = data.bio || "";
                    const phone = data.phone || ""; 
                    const designation = data.designation|| ""; 

                   
                    document.getElementById("user-name").textContent = `${user.first_name} ${user.last_name}`;
                    document.getElementById("user-email").textContent = user.email;
                    document.getElementById("username").value = user.username; 
                    document.getElementById("first-name").value = user.first_name; 
                    document.getElementById("last-name").value = user.last_name; 
                    document.getElementById("phone").value = phone; 
                    document.getElementById("designation").value = designation;
                    document.getElementById("bio").value = bio; 

                 
                } 
            })
            .catch(error => console.error('Error fetching user data:', error));
    } 

    const saveButton = document.getElementById('save-btn');
    
    saveButton.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const phone = document.getElementById('phone').value;
        const designation = document.getElementById('designation').value;
        const bio = document.getElementById('bio').value;
        const token = localStorage.getItem("token");

        const data = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            phone: phone,           
            designation: designation, 
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
            // Show success message in the alert box
            alertBox.textContent = "Your information has been saved successfully!";
            alertBox.style.display = "block";
            alertBox.classList.remove('alert-danger');
            alertBox.classList.add('alert-info');

            // Hide the alert box 
            setTimeout(() => {
                alertBox.style.display = "none";
            }, 3000);
        })
        
    });
});