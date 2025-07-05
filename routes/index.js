import express from "express";
import { getAllTest, getSingleTest } from '../controllers/test.js'

const router = express.Router();

router.get('/', getAllTest);
router.get('/:cat/:slug', getSingleTest);
// router.get('/', (req, res) => res.render('index'));


export default router;