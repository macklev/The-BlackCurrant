const bcrypt = require("bcrypt");
const { getNextSequence } = require("./counterModel");
const { toPlain } = require("./plain");
const { User } = require("./collections");

async function getAllUsers() {
    const users = await User.find().select("-password").sort({ user_id: 1 });
    return users.map(toPlain);
}

async function userExists(user) {
    if (user.handle) {
        const existingUser = await User.findOne({
            $or: [{ email: user.email }, { handle: user.handle }]
        });

        return toPlain(existingUser);
    }

    const existingUser = await User.findOne({ email: user.email });
    return toPlain(existingUser);
}

async function register(user) {
    const currentUser = await userExists(user);
    if (currentUser) throw Error("User already exists");

    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const user_id = await getNextSequence("users");

    const createdUser = await User.create({
        user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: hashedPassword,
        handle: user.handle
    });

    return toPlain(createdUser);
}

async function login(user) {
    const currentUser = await userExists(user);
    if (!currentUser) throw Error("User does not exist");

    const match = await bcrypt.compare(user.password, currentUser.password);
    if (!match) throw Error("Incorrect password");

    return currentUser;
}

async function updateUser(user_id, user) {
    const update = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        handle: user.handle
    };

    if (user.password) {
        update.password = await bcrypt.hash(user.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
        { user_id: Number(user_id) },
        update,
        { new: true }
    );

    return toPlain(updatedUser);
}

async function deleteUser(user_id) {
    await User.deleteOne({ user_id: Number(user_id) });
}

async function searchUsers(handle) {
    const users = await User.find({
        handle: { $regex: handle, $options: "i" }
    })
        .select("-password")
        .sort({ handle: 1 });

    return users.map(toPlain);
}

module.exports = { getAllUsers, register, updateUser, login, deleteUser, searchUsers };
