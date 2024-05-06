// authentication-controller.js

const { errorResponder, errorTypes } = require('../../../core/errors');
const { User } = require('../../../models');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

// Map to store login attempts and last attempt time
const loginAttemptsMap = new Map();

// Constants for login attempt limit and cooldown period
const LOGIN_ATTEMPT_LIMIT = 5;
const COOLDOWN_PERIOD = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if login attempt limit is reached
    const now = Date.now();
    const userLoginInfo = loginAttemptsMap.get(email) || {
      attempts: 0,
      lastAttemptTime: 0,
    };
    if (
      userLoginInfo.attempts >= LOGIN_ATTEMPT_LIMIT &&
      now - userLoginInfo.lastAttemptTime < COOLDOWN_PERIOD
    ) {
      throw errorResponder(
        errorTypes.TOO_MANY_ATTEMPTS,
        'Too many failed login attempts. Please try again later.'
      );
    }

    // Check login credentials
    const user = await User.findOne({ email });
    if (!user || !(await passwordMatched(password, user.password))) {
      // Increment login attempt count
      userLoginInfo.attempts++;
      userLoginInfo.lastAttemptTime = now;
      loginAttemptsMap.set(email, userLoginInfo);

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // Reset login attempt count upon successful login
    loginAttemptsMap.delete(email);

    return response.status(200).json({
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
