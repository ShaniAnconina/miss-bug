const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')

const app = express()

// App configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// --------- Bug API --------- //

// List
app.get('/api/bug', (req, res) => {
    const filterBy = {
        minSeverity: req.query.minSeverity,
        title: req.query.title,
        label: req.query.label,
    }
    const sortBy = req.query.sortBy
    bugService.query(filterBy, sortBy)
        .then((bugs) => {
            res.send(bugs)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Update
app.put('/api/bug/:bugId', (req, res) => {
    const bug = req.body
    const miniUser = req.cookies.loginToken
    bugService.save(bug, miniUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot update bug')
        })
})

// Create
app.post('/api/bug', (req, res) => {
    const bug = req.body
    const miniUser = req.cookies.loginToken
    bugService.save(bug, miniUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot create bug')
        })
})

// Read
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    var bugsViewCount = req.cookies.bugsViewCount || []
    if (bugsViewCount.length === 3) {
        res.cookie('bugsViewCount', bugsViewCount, { maxAge: 1000 * 7 })
        return res.status(401).send('Wait for a bit')
    } else {
        if (bugsViewCount.every(bug => bug.id !== bugId)) bugsViewCount.push(bugId)
        res.cookie('bugsViewCount', bugsViewCount)

        bugService.get(bugId)
            .then((bug) => {
                res.send(bug)
            })
            .catch(err => {
                console.log('Error:', err)
                res.status(400).send('Cannot get bug')
            })
    }
})

// Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const miniUser = req.cookies.loginToken
    bugService.remove(bugId, miniUser)
        .then(() => {
            res.send({ msg: 'Bug removed successfully', bugId })
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot delete bug')
        })
})


// --------- User API --------- //

// List
app.get('/api/user', (req, res) => {
    const filterBy = req.query
    userService.query(filterBy)
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get users')
        })
})

// Read
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})

// Login
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot login')
        })
})

// Signup
app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

// Logout
app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})


// Listen will always be the last line in our server!
app.listen(3030, () => console.log('Server ready at port 3030! http://localhost:3030'))