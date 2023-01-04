const { rejects } = require('assert');
const fs = require('fs');
var bugs = require('../data/bug.json');
const userService = require('./user.service.js');

module.exports = {
    query,
    get,
    remove,
    save
}

function query(filterBy, sortBy) {
    let filteredBugs = bugs
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= +filterBy.minSeverity)
    }
    if (filterBy.label) {
        filteredBugs = filteredBugs.filter(bug => bug.labels.some(label => label === filterBy.label))
    }
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.title))
    }
    if (sortBy === 'createdAt') {
        bugs.sort((a, b) => a.createdAt - b.createdAt)
    }
    if (sortBy === 'severity') {
        bugs.sort((a, b) => b.severity - a.severity)
    }
    return Promise.resolve(filteredBugs)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug not found')
    return Promise.resolve(bug)
}

function remove(bugId, miniUser) {
    const validMiniUser = userService.validateToken(miniUser)
    const userId = validMiniUser._id
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (bugs[idx].creator._id !== userId && !validMiniUser.isAdmin) return Promise.reject('Cannot delete')
    if (idx === -1) return Promise.reject('No such bug')
    bugs.splice(idx, 1)
    return _writeBugsToFile()
}

function save(bug, miniUser) {
    const validMiniUser = userService.validateToken(miniUser)
    const creator = { fullname: validMiniUser.fullname, _id: validMiniUser._id, isAdmin: validMiniUser.isAdmin }
    if (bug._id) {
        if (bug.creator._id !== creator._id && !validMiniUser.isAdmin) return Promise.reject('Cannot edit')
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        bugToUpdate.title = bug.title
        bugToUpdate.description = bug.description
        bugToUpdate.severity = +bug.severity
        bugToUpdate.createdAt = bug.createdAt
    } else {
        bug._id = _makeId()
        bug.createdAt = Date.now() + ''
        bug.creator = creator
        bugs.push(bug)
    }
    return _writeBugsToFile().then(() => bug)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _writeBugsToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return rej(err)
            res()
        })
    })
}