import path from 'path'

export function setForgotEmailData(name: string, date: string | number | Date, code: string, baseUrl: string) {
  return {
    subject: "Forgot Password Request",
    html: `
      <div>
        <p>Good day, ${name}!</p>
        <br>
        <p>You have requested a new password for the FAS account associated with your email.</p>
        <p>No changes have been made to your account yet.</p>
        <br>
        <p>You can reset your password by clicking the link below that will expire on ${new Date(date).toLocaleString("en-US", {
          dateStyle: "medium",
          timeZone: "Asia/Shanghai",
          timeStyle: "medium",
        })}.</p>
        <br>
        <p>${baseUrl}/UserManagement/changePassword?code=${code}</p>
        <p>If you did not request a new password, please contact the administrators.</p>
        <br>
        <p>Thank you.</p>
        <br>
        <img src="cid:fasLogo" alt="FAS Logo" style="width:200px;height:auto;"/>
        <br>
        <div>*** This is a system generated message. <strong>DO NOT REPLY TO THIS EMAIL</strong> ***</div>
      </div>
    `,
    attachments: [
      {
        filename: "FASlogo.svg",
        path: path.join(process.cwd(), 'public/FASlogo.svg'),
        cid: "fasLogo"
      }
    ],
    headers: {
      "Message-ID": `<${Date.now()}@fas.local>`,
    }
  }
}
