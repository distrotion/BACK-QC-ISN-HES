const express = require("express");
const router = express.Router();

router.use(require("./flow/001/sap"))
router.use(require("./flow/001/getmaster"))
router.use(require("./flow/001/upqcdata"))
router.use(require("./flow/001/1-APPINSHES"))
router.use(require("./flow/001/2-HIHMV001"))
router.use(require("./flow/001/3-HIHMV002"))
router.use(require("./flow/001/4-HIRGH001"))
router.use(require("./flow/001/5-HIMIC001"))
router.use(require("./flow/001/6-MCSINSHES"))
router.use(require("./flow/001/7-LCRUVS001"))
router.use(require("./flow/001/INSFINISH"))
router.use(require("./flow/001/cleardata"))
router.use(require("./flow/001/GRAPHMASTER"))
//
//INSFINISH
// router.use(require("./flow/004/flow004"))
// router.use(require("./flow/005/flow005"))
router.use(require("./flow/testflow/testflow"))

module.exports = router;

