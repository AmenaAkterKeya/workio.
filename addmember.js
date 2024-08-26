// Function to get query parameters from the URL
const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// Function to open the "Add Member" modal
function openAddMemberModal() {
    const boardId = getQueryParam('id'); 
    if (boardId) {
        document.getElementById('boardId').value = boardId; 
    } else {
        const errorElement = document.getElementById("error");
        errorElement.textContent = 'Board ID not found in URL';
        errorElement.style.display = "block"; 
    }

    clearForm();
}

// Function to clear the form and error messages
function clearForm() {
    document.getElementById('memberUsername').value = ''; 
    const errorElement = document.getElementById("error");
    errorElement.textContent = '';
    errorElement.style.display = 'none'; 
}

// Function to show an error message
function showError(message) {
    const errorElement = document.getElementById("error");
    errorElement.textContent = message;
    errorElement.style.display = 'block'; 

    // Hide the error message after 3 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000); 
}

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Attach the openAddMemberModal function to the modal trigger
    const modalTrigger = document.querySelector('[data-bs-toggle="modal"]');
    if (modalTrigger) {
        modalTrigger.addEventListener('click', openAddMemberModal);
    }

    // Handle the form submission for adding a member
    document.getElementById('addMemberForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const boardId = getQueryParam('id'); 
        const memberUsername = document.getElementById('memberUsername').value;
        const token = localStorage.getItem("token");

        console.log('Token:', token);
        console.log('Board ID:', boardId);

        clearForm();

        try {
            const response = await fetch(`https://workio-ypph.onrender.com/board/board/${boardId}/addmember/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ username: memberUsername })
            });

            const responseBody = await response.json();
            console.log('Response:', responseBody);

            if (!response.ok) {
                console.error('Error Response:', responseBody);
                if (Array.isArray(responseBody)) {
                    showError(responseBody.join(', ')); 
                } else {
                    showError(responseBody.detail || 'This user does not exist');
                }
                return;
            }

            // Show success message
            showError('Member added successfully!');

            // Hide the modal
            $('#addMemberModal').modal('hide');

          

        } catch (error) {
            console.error('Error adding member:', error);
            showError('Failed to add member. Please try again.');
            $('#addMemberModal').modal('hide');
        }
    });
});
