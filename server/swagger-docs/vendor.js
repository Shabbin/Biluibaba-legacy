/**
 * @swagger
 * /api/vendor/create:
 *   post:
 *     summary: Register as a vendor
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - phoneNumber
 *               - email
 *               - storeName
 *               - storeAddress
 *               - state
 *               - area
 *               - district
 *               - postcode
 *               - fullAddress
 *               - pickupAddress
 *               - nidNumber
 *               - tin
 *               - tradeLicense
 *               - bankAccountType
 *               - bankAccountName
 *               - bankAccountNumber
 *               - password
 *               - nidFront
 *               - nidBack
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Individual, Company]
 *                 example: Individual
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+8801700000000"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: vendor@example.com
 *               storeName:
 *                 type: string
 *                 example: Pet Paradise Store
 *               storeAddress:
 *                 type: string
 *               state:
 *                 type: string
 *               area:
 *                 type: string
 *               district:
 *                 type: string
 *               postcode:
 *                 type: string
 *               fullAddress:
 *                 type: string
 *               pickupAddress:
 *                 type: string
 *               nidNumber:
 *                 type: string
 *                 description: National ID number
 *               companyRegistration:
 *                 type: string
 *                 description: Required if type is Company
 *               tin:
 *                 type: string
 *                 description: Tax Identification Number
 *               tradeLicense:
 *                 type: string
 *               bankAccountType:
 *                 type: string
 *                 example: Savings
 *               bankAccountName:
 *                 type: string
 *               bankAccountNumber:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               nidFront:
 *                 type: string
 *                 format: binary
 *                 description: Front image of NID
 *               nidBack:
 *                 type: string
 *                 format: binary
 *                 description: Back image of NID
 *     responses:
 *       200:
 *         description: Vendor registration submitted for review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Your application has been submitted for review
 *       421:
 *         description: Missing required information
 *
 * /api/vendor/products:
 *   get:
 *     summary: Get all vendor products
 *     tags: [Vendors]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Vendor not authenticated
 *
 * /api/vendor/products/{id}:
 *   get:
 *     summary: Get vendor product by ID
 *     tags: [Vendors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Vendor not authenticated
 *       404:
 *         description: Product not found
 *
 * /api/vendor/orders:
 *   get:
 *     summary: Get all vendor orders
 *     tags: [Vendors]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Vendor not authenticated
 *
 * /api/vendor/order/{id}:
 *   get:
 *     summary: Get vendor order by ID
 *     tags: [Vendors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Vendor not authenticated
 *       404:
 *         description: Order not found
 */
