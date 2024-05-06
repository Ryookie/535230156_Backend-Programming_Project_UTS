const { User, Mbank } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
/**
 * Get a list of users with pagination, sorting, and filtering
 * @param {number} pageNumber - Nomor halaman yang diminta
 * @param {number} pageSize - Jumlah data per halaman
 * @param {string} sort - Kriteria pengurutan
 * @param {string} search - Kriteria pencarian (opsional)
 * @returns {Promise}
 */
async function getUsers({ pageNumber, pageSize, sort, search }) {
  // Parsing sort parameter
  console.log('martin3', sort);
  if (!pageNumber && !pageSize && !search && !sort) {
    console.log('martin7', pageNumber);
    const allUsers = await User.find()
    console.log('martin9', allUsers);
    return allUsers; 
  } else {
    const [sortField, sortOrder] = sort.split(':');
    console.log('martin8', pageNumber);
    // Constructing query based on search parameter
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = { $or: [{ name: searchRegex }, { email: searchRegex }] };
    }

    const users = await User.find(query)
      .sort({ [sortField]: sortOrder === 'desc' ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return users;
  }
}
/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

async function createMbanks(name, email, password, pin) {
  return Mbank.create({
    name,
    email,
    password,
    pin,
  });
}

async function getMbank(id) {
  return Mbank.findById(id);
}

async function updateMbank(id, name, email) {
  return Mbank.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

async function deleteMbank(id) {
  return Mbank.deleteOne({ _id: id });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  createMbanks,
  getMbank,
  updateMbank,
  deleteMbank,
};
