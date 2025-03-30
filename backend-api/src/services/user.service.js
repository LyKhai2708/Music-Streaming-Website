const fs = require('fs');
const path = require('path');
const knex = require('../database/knex');
const Paginator = require('./paginator');
const bcrypt = require('bcryptjs');
const projectRoot = path.resolve(__dirname, '..', '..');
function userRepository() {
    return knex('Users');
}

// Function to read user data from payload and return an object suitable for insertion/update
function readUser(payload) {
    return {
        username: payload.username,
        email: payload.email,
        password: payload.passwordHash,
        full_name: payload.full_name,
        avatar: payload.avatar || null, // thêm avatar vào đối tượng trả về

    };
}
async function login(email)
{
    return userRepository()
        .where('email', email)
        .select(
            'user_id',
            'password',
            'username',
            'email',
            'full_name',
            'avatar',
            'role'
        )
        .first();
}



async function updatePassword(id, oldPassword, newPassword) {
  const existingUser = await userRepository().where('user_id', id).select('*').first();
  
  if (!existingUser) {
    return null;
  }

  const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository().where('user_id', id).update({ password: hashedPassword });
  const updatedUser = { ...existingUser, password: '*****' };
  return updatedUser;
}



// Create a new user in the 'Users' table
async function createUser(payload) {
    
    const user = readUser(payload);
    const [user_id] = await userRepository().insert(user);
    return { user_id, ...user };
}

async function findUserbyEmail(email){
    return userRepository()
        .where('email', email)
        .select(
            'user_id',
        )
        .first();
}
// Get multiple users based on filter criteria
async function getManyUsers(query) {
    const { username, email, page = 1, limit = 5 } = query;
    const paginator = new Paginator(page, limit);
    let results = await userRepository()
        .where((builder) => {
            if (username) {
                builder.where('username', 'like', `%${username}%`);
            }
            if (email) {
                builder.where('email', 'like', `%${email}%`);
            }
        })
        .select(
            knex.raw('count(user_id) OVER() AS recordCount'),
            'user_id',
            'username',
            'email',
            'full_name',
            'signup_date',
            'avatar'  // Include avatar in response
        )
        .limit(paginator.limit)
        .offset(paginator.offset);
    let totalRecords = 0;
    results = results.map((result) => {
        totalRecords = result.recordCount;
        delete result.recordCount;
        return result;
    });
    return {       
        metadata: paginator.getMetadata(totalRecords),
        users: results,
    };
}

// Get a single user by ID
async function getUserById(id) {
    return userRepository()
        .where('user_id', id)
        .select(
            'user_id',
            'username',
            'email',
            'full_name',
            'signup_date',
            'avatar'  // Include avatar in response
        )
        .first();
}

// Update an existing user
async function updateUser(id, payload) {
    const existingUser = await userRepository().where('user_id', id).select('*').first();
    if (!existingUser) {
        return null;
    }

    const updatedUser = readUser(payload);
    await userRepository().where('user_id', id).update(updatedUser);

    return { ...existingUser, ...updatedUser };
}

// Delete a user by ID
async function deleteUser(id) {
    const user = await userRepository().where('user_id', id).select('*').first();
    if (!user) {
        return null;
    }
    // Kiểm tra nếu user có avatar, thực hiện xóa avatar
    
    if (user.avatar) {

        
        const avatarPath = path.join(projectRoot, user.avatar);
        try {
            fs.unlinkSync(avatarPath); // Xóa file avatar
            console.log(`Đã xóa avatar của user ${id}`);
        } catch (err) {
            console.error(`Không thể xóa avatar cho user ${id}:`, err);
        }
    }

    // Xóa user khỏi database
    await userRepository().where('user_id', id).del();
    return user;
}

// Delete all users
async function deleteAllUsers() {
    const users = await userRepository().select('avatar');
    for (const user of users) {
        if (user.avatar) {
            console.log("đang xóa avatar");
            const avatarPath = path.join(projectRoot, user.avatar);
            try {
                fs.unlinkSync(avatarPath); // Xóa file avatar
            } catch (err) {
                console.error(`Không thể xóa avatar:`, err);
            }
        }
    }
    await userRepository().del();
}
module.exports = {
    createUser,
    getManyUsers,
    getUserById,
    updateUser,
    deleteUser,
    deleteAllUsers,
    findUserbyEmail,
    login,
    updatePassword
};
