/**
 * @swagger
 * /api/product/get/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *         example: premium-dog-food
 *     responses:
 *       200:
 *         description: Product details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *                 products:
 *                   type: array
 *                   description: Related products
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/product/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (searches name and tags)
 *         example: dog food
 *     responses:
 *       200:
 *         description: Search results
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
 *
 * /api/product/{type}/{category}:
 *   get:
 *     summary: Get products by type and category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [featured, parent, sub]
 *         description: Product filter type
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *         example: dog
 *     responses:
 *       200:
 *         description: Products retrieved
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
 *
 * /api/product/get:
 *   get:
 *     summary: Get pet products with pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: parent
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent category (e.g., dog, cat)
 *         example: dog
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Product category
 *         example: food
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number for pagination (40 items per page)
 *     responses:
 *       200:
 *         description: Products retrieved
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
 *                 totalProducts:
 *                   type: integer
 *                   description: Total number of products
 *
 * /api/product/best-deals:
 *   get:
 *     summary: Get best deals products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number for pagination (40 items per page)
 *     responses:
 *       200:
 *         description: Best deals retrieved
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         $ref: '#/components/schemas/Product'
 *                 totalProducts:
 *                   type: integer
 *                 duration:
 *                   type: object
 *                   description: Deal duration settings
 *
 * /api/product/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *               - description
 *               - categories
 *               - price
 *               - quantity
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Dog Food
 *               description:
 *                 type: string
 *                 example: High quality dog food for all breeds
 *               categories:
 *                 type: string
 *                 description: JSON string of categories array
 *                 example: '[{"parent":"dog","category":"food","sub":"dry-food"}]'
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *                 example: dog,food,premium
 *               size:
 *                 type: number
 *                 example: 5
 *               price:
 *                 type: number
 *                 example: 1500
 *               discount:
 *                 type: number
 *                 example: 10
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Product submitted for review
 *       401:
 *         description: Vendor not authenticated
 *       422:
 *         description: Missing required fields
 *
 * /api/product/update:
 *   post:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discount:
 *                 type: number
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Vendor not authenticated
 *       404:
 *         description: Product not found
 *
 * /api/product/delete/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       401:
 *         description: Vendor not authenticated
 *       404:
 *         description: Product not found
 *
 * /api/product/status/{id}:
 *   post:
 *     summary: Update product status
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product status updated
 *       401:
 *         description: Vendor not authenticated
 *
 * /api/product/rating:
 *   post:
 *     summary: Submit a product review
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The product ID to review
 *               comment:
 *                 type: string
 *                 example: Great product, my dog loves it!
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Review added
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Product not found
 *       422:
 *         description: Invalid rating value or missing information
 */
