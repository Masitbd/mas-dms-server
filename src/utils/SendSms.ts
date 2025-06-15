import axios from "axios";
import config from "../app/config";
import AppError from "../app/errors/APiError";
import status from "http-status";

type TSMSProps = {
  Receiver: string;
  message: string;
};

export const SendSMS = async ({ Receiver, message }: TSMSProps) => {
  try {
    // Sending the actual SMS using POST
    const sendSmsResponse = await axios.post(`${config.sms.api_url}/smsapi`, {
      api_key: config.sms.api_key,
      senderid: config.sms.sender_id,
      number: Receiver, // Should be formatted as '88016xxxxxxxx,88019xxxxxxxx'
      message: message,
    });

    return sendSmsResponse.data;
  } catch (error) {
    console.log(error, "erro");
    throw new AppError(status.BAD_REQUEST, "Failed to send sms"); // Optionally, rethrow the error if needed for further handling
  }
};

// ? send dynamtic ssms

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendDynamicSMS = async (messages: any) => {
  // console.log(messages, "in sms");
  try {
    const sendDynamicSMSResponse = await axios.post(
      `${config.sms.api_url}/smsapimany`,
      {
        api_key: config.sms.api_key,
        senderid: config.sms.sender_id,
        messages: messages,
      }
    );

    return sendDynamicSMSResponse.data;
  } catch (error) {
    throw new AppError(status.BAD_GATEWAY, "Sms Not Sent");
  }
};
