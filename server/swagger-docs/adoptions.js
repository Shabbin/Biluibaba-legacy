/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Get all approved adoptions
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Adoptions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 adoptions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 *
 * /api/adoptions/get/{id}:
 *   get:
 *     summary: Get adoption by ID
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Adoption ID
 *     responses:
 *       200:
 *         description: Adoption details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 adoption:
 *                   $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Adoption not found
 *
 * /api/adoptions/validate:
 *   post:
 *     summary: Validate adoption order payment
 *     tags: [Adoptions]
 *     description: Callback endpoint for payment gateway
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               val_id:
 *                 type: string
 *               tran_id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to success or failure page
 *
 * /api/adoptions/application:
 *   get:
 *     summary: Get adoption application details
 *     tags: [Adoptions]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Adoption order ID
 *     responses:
 *       200:
 *         description: Application details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 order:
 *                   $ref: '#/components/schemas/AdoptionOrder'
 *       404:
 *         description: Order not found
 *
 *   post:
 *     summary: Update adoption application details
 *     tags: [Adoptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               area:
 *                 type: string
 *               address:
 *                 type: string
 *               whyAdopt:
 *                 type: string
 *               petProof:
 *                 type: string
 *               takeCareOfPet:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application updated
 *       404:
 *         description: Order not found
 *
 * /api/adoptions/create:
 *   post:
 *     summary: Create a new adoption listing
 *     tags: [Adoptions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - description
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 example: Buddy
 *               species:
 *                 type: string
 *                 example: Dog
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               age:
 *                 type: string
 *                 example: "2 years"
 *               breed:
 *                 type: string
 *                 example: Golden Retriever
 *               size:
 *                 type: string
 *                 enum: [small, medium, large]
 *               vaccinated:
 *                 type: string
 *                 enum: [yes, no]
 *               neutered:
 *                 type: string
 *                 enum: [yes, no]
 *               color:
 *                 type: string
 *                 description: Comma-separated colors
 *                 example: "golden,white"
 *               location:
 *                 type: string
 *                 example: Dhaka
 *               phoneNumber:
 *                 type: string
 *               description:
 *                 type: string
 *                 example: Friendly and well-trained dog looking for a loving home
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Adoption listing created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Adoption listing submitted for review
 *       401:
 *         description: User not authenticated
 *       421:
 *         description: Missing required information
 *
 * /api/adoptions/order:
 *   post:
 *     summary: Submit adoption application
 *     tags: [Adoptions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adoptionId
 *               - name
 *               - phoneNumber
 *               - area
 *               - address
 *               - whyAdopt
 *               - takeCareOfPet
 *             properties:
 *               adoptionId:
 *                 type: string
 *                 description: ID of the adoption listing
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+8801700000000"
 *               area:
 *                 type: string
 *                 example: Dhaka
 *               address:
 *                 type: string
 *                 example: House 10, Road 5, Mirpur
 *               whyAdopt:
 *                 type: string
 *                 example: I love pets and want to give a loving home
 *               petProof:
 *                 type: string
 *                 description: Proof of pet ownership experience
 *               takeCareOfPet:
 *                 type: string
 *                 description: How will you take care of the pet
 *     responses:
 *       200:
 *         description: Application submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 redirectUrl:
 *                   type: string
 *                   description: Payment gateway URL for adoption fee
 *       401:
 *         description: User not authenticated
 *       421:
 *         description: Missing information
 *
 * /api/adoptions/list:
 *   get:
 *     summary: Get user's adoption listings
 *     tags: [Adoptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User's adoption listings retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 adoptions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 *       401:
 *         description: User not authenticated
 *
 * /api/adoptions/wishlist:
 *   get:
 *     summary: Get user's adoption wishlist
 *     tags: [Adoptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 *       401:
 *         description: User not authenticated
 *
 * /api/adoptions/delete/{id}:
 *   post:
 *     summary: Delete an adoption listing
 *     tags: [Adoptions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Adoption ID
 *     responses:
 *       200:
 *         description: Adoption deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Adoption not found
 */
