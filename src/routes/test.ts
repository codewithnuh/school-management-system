import authWithRBAC from '@/middleware/auth.middleware'
import express from 'express'
const router = express()
router.get('/', authWithRBAC(['OWNER']), (req, res) => {
    res.json({ msg: 'Testing....', cookies: req.cookies })
})

export default router
