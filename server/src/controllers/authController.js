const { User, Otp } = require('../../models');
const { sendWhatsAppOtp } = require('../utils/whatsapp');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Sanitize and split phone number
  let digits = phoneNumber.replace(/\D/g, '');
  let countryCode = '91';
  let phone = digits;

  if (digits.length > 10) {
    countryCode = digits.slice(0, digits.length - 10);
    phone = digits.slice(-10);
  }

  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60000);

  try {
    // Save OTP to database
    await Otp.create({
      countryCode,
      phoneNumber: phone,
      code: otpCode,
      expiresAt,
    });

    // Send via WhatsApp (using the full string for the API)
    await sendWhatsAppOtp(countryCode + phone, otpCode);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({ message: 'Phone number and code are required' });
  }

  let digits = phoneNumber.replace(/\D/g, '');
  let countryCode = '91';
  let phone = digits;

  if (digits.length > 10) {
    countryCode = digits.slice(0, digits.length - 10);
    phone = digits.slice(-10);
  }

  try {
    const otpRecord = await Otp.findOne({
      where: {
        countryCode,
        phoneNumber: phone,
        code,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date()
        }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Find or create user
    let [user, created] = await User.findOrCreate({
      where: { countryCode, phoneNumber: phone }
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, countryCode: user.countryCode, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        countryCode: user.countryCode,
        phoneNumber: user.phoneNumber,
        isNewUser: created
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp };
