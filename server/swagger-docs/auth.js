/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - phoneNumber
 *               - email
 *               - password
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [traditional, google, facebook]
 *                 description: Authentication type
 *                 example: traditional
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+8801700000000"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: User registered successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=abcde12345; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *       401:
 *         description: Account already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Missing information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [traditional, google, facebook]
 *                 example: traditional
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Required for traditional login
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Required for traditional login
 *               from:
 *                 type: string
 *                 description: Redirect URL for OAuth
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=abcde12345; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/auth/google:
 *   get:
 *     summary: Authenticate with Google OAuth
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Google OAuth authorization code
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter for CSRF protection
 *     responses:
 *       302:
 *         description: Redirect to frontend with authentication
 *       400:
 *         description: Invalid OAuth code
 *
 * /api/auth/facebook:
 *   get:
 *     summary: Authenticate with Facebook OAuth
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Facebook OAuth
 *
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/auth/update-profile:
 *   post:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe Updated
 *               phoneNumber:
 *                 type: string
 *                 example: "+8801700000001"
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   state:
 *                     type: string
 *                   area:
 *                     type: string
 *                   district:
 *                     type: string
 *                   postcode:
 *                     type: string
 *                   address:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: User not found
 *       422:
 *         description: Missing information
 *
 * /api/auth/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, pending, processing, shipped, delivered, cancelled]
 *         description: Filter orders by status
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
 *       422:
 *         description: Missing type parameter
 *
 * /api/auth/vet:
 *   get:
 *     summary: Get user vet bookings
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [online, physical, emergency, homeService]
 *         description: Filter bookings by type
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       422:
 *         description: Missing type parameter
 *
 * /api/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Clears the token cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
