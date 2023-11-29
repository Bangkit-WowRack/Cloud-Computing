const nodemailer = require('nodemailer');

const html = `
  <h1>Email Terkirim</h1>
  <p>Bisa terkirim nih</p>
  <b>CPU: ~</b> <br>
  <b>Memory: ~</b> <br>
  <b>Bandwidth: ~</b> <br>
`;

// const email = [ '4gustiagunng@gmail.com', '8gustiagung@gmail.com' ]

async function main(){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bangkitwowrack@gmail.com',
            pass: 'yfqvaqikranhebic'
        }
    });

    const info = await transporter.sendMail({
        from: 'CloudRaya Anomaly Detection <4gustiagung@gmail.com>',
        to: '8gustiagung@gmail.com',
        subject: 'Check Your VM Now !',
        html: html,

    });

    console.log('Message sent: ' + info.messageId);

}

main().catch(e => console.log(e));