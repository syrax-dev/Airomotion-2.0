import { Router } from "express";

import enquiryRoutes from "./enquiry.routes.js";
import registrationRoutes from "./registration.routes.js";

const router = Router();

router.use("/enquiry", enquiryRoutes);
router.use("/product-registration", registrationRoutes);

export default router;

