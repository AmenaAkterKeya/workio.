document.addEventListener('DOMContentLoaded', function () {
    const boardId = getQueryParams('id');
    if (boardId) {
        fetchBoardDetails(boardId);
        fetchBoardMembers(boardId);
    } else {
        console.error('Board ID is missing in the URL.');
    }
});
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
function getQueryParams(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
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
                                   <li style="cursor: not-allowed; opacity: 0.5;" onclick="return false;">
    <a class="dropdown-item edit-icon" href="#">
        <i class="fa-solid fa-pen" style="margin-right: 10px;"></i>Edit
    </a>
</li>
                                    <li onclick="return false;"style="cursor: not-allowed; opacity: 0.5;">
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
                fetchCards(list.id); // Fetch and display cards for this list
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

function fetchCards(listId) {
    const token = localStorage.getItem("token");
    console.log(token)
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

                // Loop through assigned members and concatenate usernames
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
                            ">${assignedMemberUsernames}</span></small>
                        </div>
                        <div>
                            <div class="dropdown">
                                <button class="btn" type="button" id="dropdownMenuButton${card.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${card.id}">
                                   <li onclick="showEdittModal('${card.id}', '${card.title}', '${card.content}', '${listId}', '${card.priority}', '${card.status}')">
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

document.getElementById('addListForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const token = localStorage.getItem("token");
    const listInput = document.getElementById('listInput').value.trim();
    const boardId = getQueryParams('id');

    if (listInput === '' || !boardId) {
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
            title: listInput,
            board: parseInt(boardId) 
        })
    })
    .then(response => {
        // console.log('API Response:', response); 
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error details:', errorData);
                throw new Error(`Server responded with ${response.status}: ${errorData.detail || 'Unknown error'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        // console.log('Parsed Response Data:', data); 
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


function showCardModal(listId) {
    const modal = new bootstrap.Modal(document.getElementById('cardModal'));
    document.getElementById('listId').value = listId;
    modal.show();
}

// Add a card
document.getElementById('addCardForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const listId = document.getElementById('listId').value;
    const title = document.getElementById('cardTitle').value;
    const content = document.getElementById('cardContent').value;
    const priority = document.getElementById('cardPriority').value;
    const status = document.getElementById('cardStatus').value;
    const token = localStorage.getItem("token");

    if (title === '' || content === '') {
        console.log('Card title or content is empty.');
        return;
    }

    fetch(`https://workio-ypph.onrender.com/board/list/${listId}/card/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, priority, status, list: listId })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error details:', errorData);
                throw new Error(`Server responded with ${response.status}: ${errorData.detail || 'Unknown error'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Card added:', data);
        showAlert('Card added successfully!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('cardModal'));
        modal.hide();
        fetchBoardMembers(getQueryParams('id'));
    })
    .catch(error => {
        console.error('Error adding card:', error);
        showAlert('Failed to add card.', 'danger');
    });
});


function showEdittModal(cardId, title, content, priority, status) {
    // Fill the edit modal with the card's existing data
    document.getElementById('editCardId').value = cardId;
    document.getElementById('editCardTitle').value = title;
    document.getElementById('editCardContent').value = content;
    document.getElementById('editCardPriority').value = priority;
    document.getElementById('editCardStatus').value = status;

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editCardModal'));
    editModal.show();
}

// Handle the form submission for editing the card
document.getElementById('editCardForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cardId = document.getElementById('editCardId').value;
    const title = document.getElementById('editCardTitle').value;
    const content = document.getElementById('editCardContent').value;
    const priority = document.getElementById('editCardPriority').value;
    const status = document.getElementById('editCardStatus').value;
    const token = localStorage.getItem("token");

    fetch(`https://workio-ypph.onrender.com/board/card/${cardId}/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, priority, status })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error details:', errorData);
                throw new Error(`Server responded with ${response.status}: ${errorData.detail || 'Unknown error'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Card updated:', data);
        showAlert('Card updated successfully!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editCardModal'));
        modal.hide();
        window.location.reload();
        fetchCards(data.list); // Refresh the cards after editing
    })
    .catch(error => {
        console.error('Error updating card:', error);
        showAlert('Failed to update card.', 'danger');
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
            showAlert('Card deleted successfully!', 'success'); // Show success message
            window.location.reload();
        } else {
            console.log('Unexpected response:', data);
        }
    })
    .catch(error => {
        console.error('Error deleting card:', error);
        showAlert('Failed to delete card.', 'danger'); // Show error message
    });
}

