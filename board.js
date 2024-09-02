document.addEventListener('DOMContentLoaded', function () {
    const boardId = getQueryParams('id');
    if (boardId) {
        fetchBoardDetails(boardId);
        fetchBoardMembers(boardId);
    } else {
        console.error('Board ID is missing in the URL.');
    }
});

function getQueryParams(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
function fetchBoardDetails(boardId) {
    const token = localStorage.getItem("token");

    fetch(`https://workio-ypph.onrender.com/board/board/${boardId}/`, {
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        const boardNameElement = document.getElementById('boardName');
        if (boardNameElement) {
            boardNameElement.textContent = data.name;
        } else {
            console.error('Board name element not found.');
        }
    })
    .catch(error => {
        console.error('Error fetching board details:', error);
    });
}
function fetchBoardMembers(boardId) {
    const token = localStorage.getItem("token");

    fetch(`https://workio-ypph.onrender.com/board/list/?search=${boardId}`, {
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        const listContainer = document.getElementById('listContainer');
        const formContainer = document.getElementById('formContainer');

        if (!listContainer || !formContainer) {
            console.error('One or more required elements are missing.');
            return;
        }

        listContainer.innerHTML = '';

        const heading = document.createElement('h4');
        heading.textContent = 'Lists';
        heading.style.fontSize = '28px';
        heading.style.fontWeight = '600';
        listContainer.appendChild(heading);

        if (data.length > 0) {
            data.forEach(list => {
                const listElement = document.createElement('div');
                listElement.className = 'col-4';
                listElement.style.backgroundColor = 'rgb(78 82 208 / 21%)';
                listElement.style.padding = '10px';
                listElement.style.marginBottom = '10px';
                listElement.style.width = '100%';
                listElement.style.borderRadius = '5px';

                listElement.innerHTML = `
                    <div class="icon-container" style="display: flex; justify-content: space-between; margin-bottom: 10px;"> 
                        <div>
                            <p style="font-size: 24px; font-weight: 500;">${list.title}</p>
                        </div>
                        <div>
                            <div class="dropdown">
                                <button class="btn" type="button" id="dropdownMenuButton${list.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${list.id}">
                                    <li onclick="showEditModal('${list.id}', '${list.title}', '${list.content}')">
                                        <a class="dropdown-item edit-icon" href="#">
                                            <i class="fa-solid fa-pen" style="cursor: pointer; margin-right: 10px;"></i>Edit
                                        </a>
                                    </li>
                                    <li onclick="deleteItem('${list.id}')">
                                        <a class="dropdown-item delete-icon" href="#">
                                            <i class="fa-solid fa-delete-left" style="cursor: pointer; margin-right: 10px;"></i>Delete
                                        </a>
                                    </li>
                                    <li onclick="showCardModal('${list.id}')">
                                        <a class="dropdown-item" href="#">
                                            <i class="fa-solid fa-id-card-clip" style="cursor: pointer; margin-right: 10px;"></i>Card
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div id="cardsContainer${list.id}" class="cards-container"></div> <!-- Container for cards -->
                `;

                listContainer.appendChild(listElement);
                fetchCards(list.id); 
                
            });

            listContainer.style.display = 'block';
            formContainer.style.flexDirection = 'row';
        } else {
            listContainer.style.display = 'none';
            formContainer.style.flexDirection = 'row-reverse';
        }
    })
    .catch(error => {
        console.error('Error fetching board members:', error);
    });
}






function showEditModal(id, title, content) {
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    const editListId = document.getElementById('editListId');
    const editListTitle = document.getElementById('editListTitle');
    const editListContent = document.getElementById('editListContent');

    editListId.value = id;
    editListTitle.value = title;
    editListContent.value = content;

    modal.show();
}

document.getElementById('editListForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const id = document.getElementById('editListId').value;
    const title = document.getElementById('editListTitle').value.trim();
    const content = document.getElementById('editListContent').value.trim();

    if (title === '' || content === '') {
        console.log('List title or content is empty.');
        return;
    }

    const boardId = getQueryParams('id'); 
    const token = localStorage.getItem("token");

    fetch(`https://workio-ypph.onrender.com/board/board/${boardId}/list/${id}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, content: content })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('List item updated:', data);
        showAlert('List item updated successfully!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();
        window.location.reload();
        fetchBoardMembers(boardId); 
    })
    .catch(error => {
        console.error('Error updating list item:', error);
        showAlert('Failed to update list item.', 'danger'); 
    });
});

function deleteItem(id) {
    const boardId = getQueryParams('id'); 
    const token = localStorage.getItem("token");

    fetch(`https://workio-ypph.onrender.com/board/board/${boardId}/list/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json().catch(() => ({ }));
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    })
    .then(data => {
        if (Object.keys(data).length === 0) {
            console.log('List item deleted successfully.');
            showAlert('List item deleted successfully!', 'success'); 
        } else {
            console.log('List item deleted:', data);
        }
        fetchBoardMembers(boardId); 
    })
    .catch(error => {
        console.error('Error deleting list item:', error);
        showAlert('Failed to delete list item.', 'danger'); 
    });
}


function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('error');
    alertContainer.textContent = message;
    alertContainer.className = `alert alert-${type}`; 
    alertContainer.style.display = 'block';


    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 15000);
}

document.addEventListener('DOMContentLoaded', function() {
    const addListForm = document.getElementById('addListForm');
    const listInput = document.getElementById('listInput');
    const listContainer = document.getElementById('listContainer');

    function getQueryParams(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const boardId = getQueryParams('id');

    addListForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const token = localStorage.getItem("token");
        const listTitle = listInput.value.trim();

        if (listTitle === '' || !boardId) {
            console.log('List title is empty or boardId is missing');
            return; 
        }

        fetch(`https://workio-ypph.onrender.com/board/list/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: listTitle,
                board: parseInt(boardId) 
            })
        })
        .then(response => {
            console.log('API Response:', response); 
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Error details:', errorData);
                    throw new Error(`Server responded with ${response.status}: ${errorData.detail || 'Unknown error'}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Parsed Response Data:', data); 

            if (data && data.id) {
             
               window.location.reload();
            } else {
                console.error('Error creating list:', data);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });
});


function fetchCards(listId) {
    const token = localStorage.getItem("token");

    fetch(`https://workio-ypph.onrender.com/board/cards/?search=${listId}`, {
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Fetched cards data:', data); // Debugging line

        const cardsContainer = document.getElementById(`cardsContainer${listId}`);
        if (!cardsContainer) {
            console.error('Cards container not found');
            return;
        }

        cardsContainer.innerHTML = ''; // Clear existing cards

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.style.marginBottom = '10px';
                cardElement.style.padding = '10px';
                cardElement.style.backgroundColor = '#ffffff';
                cardElement.style.border = '1px solid #ddd';
                cardElement.style.borderRadius = '5px';

               
                let assignedMemberUsernames = 'Not Assigned';
                if (Array.isArray(card.assigned_member) && card.assigned_member.length > 0) {
                    assignedMemberUsernames = card.assigned_member.map(member => member.username).join(', ');
                }

                cardElement.innerHTML = `
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    ">
                        <div>
                            <h5 style="font-weight: bold;">${card.title}</h5>
                            <small style="
                                font-size: 15px;
                            ">Priority: <span style="
                                background-color: #ffcbb8;
                                padding: 4px;
                                border-radius: 4px;
                                text-transform: capitalize;
                                margin-left: 4px;
                                margin-right: 10px;
                            ">${card.priority}</span> 
                            <span> | </span> Status: <span style="
                                background-color: #b8ffef;
                                padding: 4px;
                                border-radius: 4px;
                                text-transform: capitalize;
                                margin-left: 4px;
                            ">${card.status}</span> 
                            <span> | </span> Assign: <span style="
                                background-color: #ffcbb8;
                                padding: 4px;
                                border-radius: 4px;
                                text-transform: capitalize;
                                margin-left: 4px;
                            ">${assignedMemberUsernames}</span>  <span> | </span> Due Date: <span style="
                                background-color: #b8ffef;
                                padding: 4px;
                                border-radius: 4px;
                                text-transform: capitalize;
                                margin-left: 4px;
                            ">${card.due_date}</span> </small>
                        </div>
                        <div>
                            <div class="dropdown">
                                <button class="btn" type="button" id="dropdownMenuButton${card.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${card.id}">
                                   <li onclick="showEdittModal('${card.id}', '${card.title}', '${card.content}', '${listId}', '${card.priority}', '${card.status}','${card.assigned_members}','${card.due_date}')">
    <a class="dropdown-item edit-icon" href="#">
        <i class="fa-solid fa-pen" style="cursor: pointer; margin-right: 10px;"></i>Edit
    </a>
</li>
                                    <li onclick="deleteItemm('${card.id}')">
                                        <a class="dropdown-item delete-icon" href="#">
                                            <i class="fa-solid fa-delete-left" style="cursor: pointer; margin-right: 10px;"></i>Delete
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;

                cardsContainer.appendChild(cardElement);
            });
        } else {
            const noCardsMessage = document.createElement('p');
            noCardsMessage.textContent = 'No cards available.';
            cardsContainer.appendChild(noCardsMessage);
        }
    })
    .catch(error => {
        console.error('Error fetching cards:', error);
    });
}


function showCardModal(listId) {
    const modal = new bootstrap.Modal(document.getElementById('cardModal'));
    document.getElementById('listId').value = listId;
    modal.show();
}

document.addEventListener("DOMContentLoaded", function () {
 
    const boardId = getQueryParams('id');
     const token = localStorage.getItem("token");
     fetch(`https://workio-ypph.onrender.com/board/board/${boardId}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
        .then(response => response.json())
        .then(data => {
            const assignedMemberSelect = document.getElementById('assignedMember');
            assignedMemberSelect.innerHTML = ''; 

            data.members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.username; 
                assignedMemberSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching board members:', error));
});

document.getElementById('addCardForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const token = localStorage.getItem("token");
            const listId = document.getElementById('listId').value;
            const cardTitle = document.getElementById('cardTitle').value;
            const cardContent = document.getElementById('cardContent').value;
            const cardPriority = document.getElementById('cardPriority').value;
            const cardStatus = document.getElementById('cardStatus').value;
            const assignedMember = document.getElementById('assignedMember').value;
            const cardDueDate = document.getElementById('cardDueDate').value;
            const cardData = {
                title: cardTitle,
                content: cardContent,
                list: parseInt(listId),
                priority: cardPriority,
                status: cardStatus,
                assigned_members: [parseInt(assignedMember)],
                due_date: cardDueDate
            };
        
            fetch(`https://workio-ypph.onrender.com/board/list/${listId}/card/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(cardData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Card added successfully:', data);
        
                const cardModal = document.getElementById('cardModal');
                const modalInstance = bootstrap.Modal.getInstance(cardModal);
                modalInstance.hide();
                
                document.getElementById('addCardForm').reset();
        
              
                fetchCards(listId);
            })
            .catch(error => console.error('Error adding card:', error));
        });




        function showEdittModal(cardId, cardTitle, cardContent, listId, cardPriority, cardStatus, assignedMembers, cardDueDate = '') {
            console.log('Assigned Members:', assignedMembers); 
            console.log('List ID in showEdittModal:', listId); 
        
            // Set the card ID and list ID
            document.getElementById('editCardId').value = cardId;
            document.getElementById('listId').value = listId; 
        
            document.getElementById('editCardTitle').value = cardTitle;
            document.getElementById('editCardContent').value = cardContent;
            document.getElementById('editCardPriority').value = cardPriority;
            document.getElementById('editCardStatus').value = cardStatus;
            document.getElementById('editCardDueDate').value = cardDueDate;
        
            const validAssignedMembers = Array.isArray(assignedMembers) ? assignedMembers : [];

            const assignedMemberIds = validAssignedMembers.map(member => member.id);
        
            fetchMembers(assignedMemberIds);
       
            const editCardModal = new bootstrap.Modal(document.getElementById('editCardModal'));
            editCardModal.show();
        }
        
        function fetchMembers(assignedMemberIds = []) {
            const token = localStorage.getItem("token");
            const boardId = getQueryParams('id');
        
            fetch(`https://workio-ypph.onrender.com/board/board/${boardId}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                }
            })
            
            .then(response => response.json())
            .then(data => {
                console.log('Fetched board data:', data); 
        
                const memberSelect = document.getElementById('editAssignedMember');
                memberSelect.innerHTML = '';
        
                if (data.members) {
                    data.members.forEach(member => {
                        const option = document.createElement('option');
                        option.value = member.id;
                        option.textContent = member.username;
        
                        // Check if the assigned member's ID matches
                        if (assignedMemberIds.includes(member.id)) {
                            option.selected = true;
                        }
        
                        memberSelect.appendChild(option);
                    });
                } else {
                    console.error('Members field not found in API response.');
                }
            })
            .catch(error => {
                console.error('Error fetching members:', error);
            });
        }
        

document.getElementById('editCardForm').addEventListener('submit', function(e) {
            e.preventDefault();
        
            const cardId = document.getElementById('editCardId').value;
            const title = document.getElementById('editCardTitle').value;
            const content = document.getElementById('editCardContent').value;
            const listId = document.getElementById('listId').value;
            const priority = document.getElementById('editCardPriority').value;
            const status = document.getElementById('editCardStatus').value;
            const dueDate = document.getElementById('editCardDueDate').value;
            const assignedMembers = Array.from(document.getElementById('editAssignedMember').selectedOptions).map(option => parseInt(option.value));
        
            if (!listId) {
                showAlert('List ID is required.', 'error');
                return;
            }
        
            const token = localStorage.getItem("token");
        
            fetch(`https://workio-ypph.onrender.com/board/card/${cardId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    list: parseInt(listId),
                    priority: priority,
                    status: status,
                    assigned_members: assignedMembers, // This should be an array of integers
                    due_date: dueDate, 
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => { throw error; });
                }
                return response.json();
            })
            .then(data => {
                console.log('Card updated:', data);
        
                const editCardModal = bootstrap.Modal.getInstance(document.getElementById('editCardModal'));
                editCardModal.hide();
        
                showAlert('Card updated successfully!', 'success');
        
                fetchCards(listId);
            })
            .catch(error => {
                console.error('Error updating card:', error);
                showAlert('Error updating card. Please try again.', 'error');
            });
        });
        

function deleteItemm(cardId) {
    const token = localStorage.getItem("token");

    fetch(`https://workio-ypph.onrender.com/board/card/${cardId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`,
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json().catch(() => ({})); 
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    })
    .then(data => {
        if (Object.keys(data).length === 0) {
            console.log('Card deleted successfully.');
            showAlert('Card deleted successfully!', 'success');
            window.location.reload();
        } else {
            console.log('Unexpected response:', data);
        }
    })
    .catch(error => {
        console.error('Error deleting card:', error);
        showAlert('Failed to delete card.', 'danger'); 
    });
}
