import {MailtrapClient} from "mailtrap";
import config from "../config/config.js";
 
export const client = new MailtrapClient({token: config.mailtrapApiToken! });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "QuickEats Team",
};