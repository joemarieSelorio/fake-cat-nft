require('app-module-path').addPath(require('app-root-path').toString());
// eslint-disable-next-line new-cap
const router = require('express').Router();

const userRouters = require('src/routes/userRoutes');
const walletRouters = require('src/routes/walletRoutes');
const gelleryRouters = require('src/routes/galleryRoutes');
const assetsRouters = require('src/routes/assetRoutes');
const authRoutes = require('src/routes/authRoutes');

router.use('/', userRouters);
router.use('/', walletRouters);
router.use('/', gelleryRouters);
router.use('/', assetsRouters);
router.use('/', authRoutes);

module.exports = router;
