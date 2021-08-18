import Mail from "nodemailer/lib/mailer";
import dataStoreInstance from "../../data/data-store";

interface SmtpServiceBaseInterface {}

export abstract class SmtpServiceBase implements SmtpServiceBaseInterface {
    abstract sendEmail(): Promise<void>; // check types

    abstract createEmailTransporter(): Promise<Mail>; // check types

    getEmailDataForSend = () => {
        return dataStoreInstance.getEmailData();
    };
}
