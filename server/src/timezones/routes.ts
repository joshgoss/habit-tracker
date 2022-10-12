import { Router } from "express";
import { timeZonesNames } from "@vvo/tzdb";

const router = Router();

router.get("/", (req, res) => {
	return res.json({ data: timeZonesNames });
});

export default router;
