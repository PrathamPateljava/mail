document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Submit Email Handlers
  document.querySelector("#compose-form").addEventListener('submit', send_mail);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-detailed-view').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
async function view_mail(id){
  //console.log(id);
  await fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      // ... do something else with email ...
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#emails-detailed-view').style.display = 'block';
      document.querySelector('#emails-detailed-view').innerHTML=`
      <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="mb-3">
                <strong>From:</strong> ${email.sender}
              </div>
              <div class="mb-3">
                <strong>To:</strong> ${email.recipients}
              </div>
              <div class="mb-3">
                <strong>Subject:</strong> ${email.subject}
              </div>
              <div class="mb-3">
                <strong>Timestamp:</strong> ${email.timestamp}
              </div>
              <div class="mb-3">
                <button class="btn btn-primary">Reply</button>
              </div>
              <hr> <!-- Line separating the sections -->
              <div>
              ${email.body}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      `;
  })
  .then();
}
async function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-detailed-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Get all emails
  await fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      //console.log(emails);
        emails.forEach(mail=>{
          const newMail = document.createElement('div');
          newMail.className="list-group-item";
          newMail.innerHTML = `
          <h4>${mail.sender}</h4>
          <h5>${mail.subject}</h5>
          <p>${mail.timestamp}</p>
          `;
          newMail.className= mail.read ? 'read':'unread';
          newMail.addEventListener('click', function(){view_mail(mail.id)});
          document.querySelector('#emails-view').append(newMail);
        })
      // ... do something else with emails ...
  });
}

async function send_mail(event){
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

    await fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  load_mailbox('sent');
}