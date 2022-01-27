import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(user) {
    const token = jwt.sign(user,
      process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRY }
    );
    return token;
  },

  /**
   * isEmpty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
  isEmpty(input) {
    if (input === undefined || input === '') {
      return true;
    }
    if (input.replace(/\s/g, '').length) {
      return false;
    } return true;
  },

  /**
   * empty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
  empty (input) {
    if (input === undefined || input === '') {
      return true;
    }
  }

}

export default Helper;