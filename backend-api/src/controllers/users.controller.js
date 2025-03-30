const usersService = require('../services/user.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');
const { first } = require('../database/knex');
const  bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
async function createUser(req, res, next) {
  console.log(req.body);
  const { username, email, password, confirmpass, full_name} = req.body;
  if (!username || typeof username !== 'string') {
    console.log(username);
    return next(new ApiError(400, 'Username should be a non-empty string'));
  }
  if (!email || typeof email !== 'string') {
    console.log(email);
    return next(new ApiError(400, 'Email should be a non-empty string'));
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(new ApiError(400, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'));
  }
  if (password !== confirmpass ){
    return next(new ApiError(400, 'Confirm password not correct'));
  }
  try {
    
    const passwordHash = await bcrypt.hash(password,10);
    const existingUser = await usersService.findUserbyEmail(email);
    if (existingUser) {
      return next(new ApiError(400, 'Email đã được sử dụng'));
    }

    const user = await usersService.createUser({
      username,
      email,
      passwordHash,
      full_name,
      avatar: req.file ? `/public/images/${req.file.filename}` : '/public/images/OIP.jpg'
    });

    return res
      .status(201)
      .set({ Location: `${req.baseUrl}/${user.user_id}` })
      .json(JSend.success({ user }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while creating the user'));
  }
}
async function updatePassword(req, res, next) {
  console.log(req.body);
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword, newPassword);
  if (!oldPassword || !newPassword) {
    return next(new ApiError(400, 'Old password and new password are required'));
  }

  try {
    const updatedUser = await usersService.updatePassword(id, oldPassword, newPassword);
    
    if (!updatedUser) {
      return next(new ApiError(404, 'User not found'));
    }

    return res.json(JSend.success({ user: updatedUser }));
  } catch (error) {
    console.log(error);
    if (error.message === 'Old password is incorrect') {
      return next(new ApiError(400, error.message));
    }
    return next(new ApiError(500, `Error updating password for user with id=${id}`));
  }
}
async function getUsersByFilter(req, res, next) {
  let result = {
    users: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    }
  }
  
  try {
    result = await usersService.getManyUsers(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while fetching users'));
  }
  return res.json(
    JSend.success({
      users: result.users,
      metadata: result.metadata,
    })
  );
}

async function getUser(req, res, next) {
  const { id } = req.params;
  try {
    const user = await usersService.getUserById(id);
    
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    return res.json(JSend.success({ user }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error retrieving user with id=${id}`));
  }
}

async function updateUser(req, res, next) {
  
 
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, 'Data for update cannot be empty'));
  }
  const { id } = req.params;
  console.log(req.body);
  try {
    const updatedUser = await usersService.updateUser(id, {
      ...req.body,
      avatar: req.file ? `/public/images/${req.file.filename}` : null,
      });

    if (!updatedUser) {
      return next(new ApiError(404, 'User not found'));
    }

    return res.json(JSend.success({ user: updatedUser }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error updating user with id=${id}`));
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.params;

  try {
    const deletedUser = await usersService.deleteUser(id);

    if (!deletedUser) {
      return next(new ApiError(404, 'User not found'));
    }

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Could not delete user with id=${id}`));
  }
}

async function deleteAllUsers(req, res, next) {
  try {
    await usersService.deleteAllUsers();
    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while removing all users'));
  }
}


module.exports = {
  createUser,
  getUsersByFilter,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  updatePassword,
};
