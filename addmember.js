// Function to get query parameters from the URL
const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};


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

function clearForm() {
    document.getElementById('memberUsername').value = ''; 
    const errorElement = document.getElementById("error");
    errorElement.textContent = '';
    errorElement.style.display = 'none'; 
}


function showError(message) {
    const errorElement = document.getElementById("error");
    errorElement.textContent = message;
    errorElement.style.display = 'block'; 

    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000); 
}


document.addEventListener('DOMContentLoaded', () => {

    const modalTrigger = document.querySelector('[data-bs-toggle="modal"]');
    if (modalTrigger) {
        modalTrigger.addEventListener('click', openAddMemberModal);
    }

    document.getElementById('addMemberForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const boardId = getQueryParam('id'); 
        const memberUsername = document.getElementById('memberUsername').value;
        const token = localStorage.getItem("token");

        console.log('Token:', token);
        console.log('Board ID:', boardId);

        clearForm();

        try {
            const response = await fetch(`https://workio-theta.vercel.app/board/board/${boardId}/addmember/`, {
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
                    $('#addMemberModal').modal('hide');
                    showError(responseBody.detail || 'This user does not exist');
                    
                }
                return;
            }

            // Show success message
            showError('Member added successfully!');

            // Hide the modal
            $('#addMemberModal').modal('hide');
            location.reload();
          

        } catch (error) {
            console.error('Error adding member:', error);
            showError('Failed to add member. Please try again.');
            $('#addMemberModal').modal('hide');
        }
    });
});
