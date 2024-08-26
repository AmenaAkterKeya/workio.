
const getQueryParams = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};


function openAddMemberModal() {
    const boardId = getQueryParams('id'); 
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
        
        const boardId = document.getElementById('boardId').value;
        const memberUsername = document.getElementById('memberUsername').value;
        const token = localStorage.getItem("token");

        
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

            if (!response.ok) {
                
                $('#addMemberModal').modal('hide');
                if (Array.isArray(responseBody)) {
                    showError(responseBody.join(', ')); 
                } else {
                    showError(responseBody.detail || 'This user does not exist');
                }
                return;
            }

           
            showError('Member added successfully!');
            
            
            $('#addMemberModal').modal('hide');
        } catch (error) {
            console.error('Error adding member:', error);
            
            $('#addMemberModal').modal('hide');
            showError('Failed to add member. Please try again.');
        }
    });
});
