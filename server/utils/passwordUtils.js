const bcrypt = require('bcrypt')

async function hashPassword(password){
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }catch{
        throw new Error('error hashing password')
    }
}

async function comparePasswords(plainPass, hashedPass){
    try{
        return await bcrypt.compare(plainPass, hashedPass)
    }catch{
        throw new Error('error comparing passwords')
    }
}

module.exports = {hashPassword, comparePasswords}