let emailList = JSON.parse(localStorage.getItem('emailList')) || [];

function addEmail() {
    const newEmail = document.getElementById('new-email').value;
    if (newEmail && !emailList.includes(newEmail)) {
        emailList.push(newEmail);
        localStorage.setItem('emailList', JSON.stringify(emailList));
        updateEmailList();
        document.getElementById('new-email').value = '';
    }
}

function updateEmailList() {
    const list = document.getElementById('email-list');
    list.innerHTML = '';
    emailList.forEach(email => {
        const li = document.createElement('li');
        li.textContent = email;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeEmail(email);
        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

function removeEmail(email) {
    emailList = emailList.filter(e => e !== email);
    localStorage.setItem('emailList', JSON.stringify(emailList));
    updateEmailList();
}

function sendToAll() {
    const bcc = emailList.join(',');
    window.open(`https://mail.google.com/mail/?view=cm&bcc=${encodeURIComponent(bcc)}`);
}

document.getElementById('add-email').addEventListener('click', addEmail);
document.getElementById('send-all').addEventListener('click', sendToAll);

updateEmailList();
