const axios = require('axios');
require('dotenv').config();

const sendWhatsAppOtp = async (phoneNumber, otp) => {
  const url = `https://graph.facebook.com/${process.env.WHATSAPP_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: 'whatsapp',
    to: phoneNumber,
    type: 'template',
    template: {
      name: process.env.WHATSAPP_TEMPLATE_NAME,
      language: {
        code: 'en_US'
      },
      // components: [
      //   {
      //     type: 'body',
      //     parameters: [
      //       {
      //         type: 'text',
      //         text: otp
      //       }
      //     ]
      //   },
      //   {
      //     type: 'button',
      //     sub_type: 'url',
      //     index: '0',
      //     parameters: [
      //       {
      //         type: 'text',
      //         text: otp
      //       }
      //     ]
      //   }
      // ]
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to send WhatsApp message');
  }
};

module.exports = { sendWhatsAppOtp };
