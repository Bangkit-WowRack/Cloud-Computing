import nodemailer from "nodemailer";

// const email = [ '4gustiagunng@gmail.com', '8gustiagung@gmail.com' ]

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "bangkitwowrack@gmail.com",
        pass: process.env.MAIL_PWD,
    },
});

transporter.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready for messages");
    }
});

export const sendMail = async (from, subject, receiver, email_body) => {
    await transporter.sendMail({
        from: from, //"CloudRaya Anomaly Detection <4gustiagung@gmail.com>"
        to: receiver,
        subject: subject, //"Check Your VM Now !"
        html: email_body,
    });
};

// console.log("Message sent: " + sendMail.messageId);

// sendMail().catch((e) => console.log(e));
