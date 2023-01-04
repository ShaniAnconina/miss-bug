const { rejects } = require('assert');
const fs = require('fs')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('secret-puk-1234')

var users = require('../data/user.json')

module.exports = {
    query,
    get,
    remove,
    login,
    signup,
    getLoginToken,
    validateToken
}
function getLoginToken(user) {
    const miniUser = { fullname: user.fullname, _id: user._id, isAdmin: user.isAdmin }
    return cryptr.encrypt(JSON.stringify(miniUser))
}

function query(filterBy) {
    let fillteredUsers = users
    return Promise.resolve(fillteredUsers)
}

function get(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('No such user')
    users.splice(idx, 1)
}

function signup({ fullname, username, password }) {
    const userToSave = {
        _id: _makeId(),
        fullname,
        username,
        password,
        isAdmin: false
    }
    users.push(userToSave)
    return _writeUsersToFile().then(() => userToSave)
}

function login(credentials) {
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password)
    if (!user) return Promise.reject('Login failed')
    return Promise.resolve(user)
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


function _writeUsersToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) return rej(err)
            res()
        })
    })
}