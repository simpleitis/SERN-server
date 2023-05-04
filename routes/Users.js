const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt')
require('dotenv').config()
const { sign } = require('jsonwebtoken')
const { validateToken } = require('../middleware/AuthMiddleware')

router.post('/', async (req, res) => {
    const { username, password } = req.body
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        })
        res.json('SUCCESS')
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = await Users.findOne({ where: { username: username } })

    if (!user) return res.json({ error: "User Doesn't Exist" })

    bcrypt.compare(password, user.password).then((match) => {
        if (!match)
            return res.json({
                error: 'Wrong Username And Password Combination',
            })

        const acceessToken = sign(
            { username: user.username, id: user.id },
            process.env.SECRET
        )

        return res.json({
            token: acceessToken,
            username: username,
            id: user.id,
        })
    })
})

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user)
})

router.get('/basicinfo/:id', async (req, res) => {
    const id = req.params.id

    const basicInfo = await Users.findByPk(id, {
        attributes: { exclude: ['password'] },
    })

    res.json(basicInfo)
})

router.put('/changepassword', validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await Users.findOne({ where: { username: req.user.username } })

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) res.json({ error: 'Wrong Password Entered!' })

        bcrypt.hash(newPassword, 10).then((hash) => {
            Users.update(
                { password: hash },
                { where: { username: req.user.username } }
            )
            res.json('SUCCESS')
        })
    })
})

module.exports = router
