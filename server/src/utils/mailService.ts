import nodemailer from "nodemailer";


const EMAIL_FROM = "l_weixiang@outlook.com";
const EMAIL_PASS = "ilove1828002876";

export const sendEmail=(to:string,content:{title:string,text:string}):boolean=>{
    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: EMAIL_FROM,
            pass: EMAIL_PASS
        }
    });
    const mailOptions = {
        from: EMAIL_FROM,
        to: to,
        subject: content.title,
        html: content.text,
    };
    let sent = false;
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            sent = true;
        }
    });
    return sent;
}