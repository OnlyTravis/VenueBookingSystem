const { PrismaClient } = require('@prisma/client');
const { createHash } = require('crypto')

const prisma = new PrismaClient();

const addUser = (username, password, role) => {
    //hashing password
    const password_hash = createHash('sha256').update(password).digest("base64");

    //turning role to integer
    const role_int = role === "student"?0:(role === "teacher"?1:-1);
    if (role_int === -1) {
        console.log(`Cannnot create user with role '${role}'.\nUsername: ${username}, Password: ${password}`);
    }

    //adding user to database
    console.log(`Account created! Username: ${username}, Password: ${password}, Hash: ${password_hash}.`);
    return prisma.users.create({
        data: {
            username: username,
            password: password_hash,
            permission: role_int
        }
    })
};

async function main() {
    await addUser("student123", "password123", "student");
}

module.exports = {
    addUser,
    getUser : (username) => {
        return prisma.users.findFirst({
            where: {
                username: username,
            }
        });
    },
    verifyPassword : (password, hashed_password) => {
        const hash = createHash('sha256').update(password).digest("base64");
        return (hash === hashed_password);
    },
    changePassword: async (username, new_password) => {
        const password_hash = createHash('sha256').update(new_password).digest("base64");
        
        await prisma.users.update({
            where: {
                username: username
            },
            data: {
                password: password_hash,
            }
        });
    }
}
