/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@biluibaba.com
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *
 * /api/admin/site-settings:
 *   get:
 *     summary: Get site settings (public)
 *     tags: [Admin - Site Settings]
 *     responses:
 *       200:
 *         description: Site settings retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 settings:
 *                   type: object
 *                   description: Site configuration settings
 *
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/adoptions/fetch:
 *   get:
 *     summary: Get all approved adoptions for admin
 *     tags: [Admin - Adoptions]
 *     security:
 *       - cookieAuth: []
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
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/adoptions/status/{id}:
 *   post:
 *     summary: Update adoption status
 *     tags: [Admin - Adoptions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Adoption ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, adopted]
 *     responses:
 *       200:
 *         description: Status updated
 *       401:
 *         description: Admin not authenticated
 *       404:
 *         description: Adoption not found
 *
 * /api/admin/adoptions/order:
 *   get:
 *     summary: Get all adoption orders
 *     tags: [Admin - Adoptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Adoption orders retrieved
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
 *                     $ref: '#/components/schemas/AdoptionOrder'
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/adoptions/order/{id}:
 *   get:
 *     summary: Get adoption order by ID
 *     tags: [Admin - Adoptions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Adoption order ID
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
 *                   $ref: '#/components/schemas/AdoptionOrder'
 *       401:
 *         description: Admin not authenticated
 *       404:
 *         description: Order not found
 *
 * /api/admin/vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Admin - Vendors]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Vendors retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vendors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vendor'
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/vendors/{id}:
 *   get:
 *     summary: Get vendor by ID
 *     tags: [Admin - Vendors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vendor:
 *                   $ref: '#/components/schemas/Vendor'
 *       401:
 *         description: Admin not authenticated
 *       404:
 *         description: Vendor not found
 *
 * /api/admin/vendors/status:
 *   post:
 *     summary: Update vendor status
 *     tags: [Admin - Vendors]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vendorId
 *               - status
 *             properties:
 *               vendorId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/vendors/products:
 *   get:
 *     summary: Get all vendor products
 *     tags: [Admin - Vendors]
 *     security:
 *       - cookieAuth: []
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
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/products/{productId}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Admin - Vendors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved
 *       401:
 *         description: Admin not authenticated
 *       404:
 *         description: Product not found
 *
 * /api/admin/products/status:
 *   post:
 *     summary: Update product status
 *     tags: [Admin - Vendors]
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
 *               - status
 *             properties:
 *               productId:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin - Vendors]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved
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
 *         description: Admin not authenticated
 *
 * /api/admin/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Admin - Vendors]
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
 *       401:
 *         description: Admin not authenticated
 *       404:
 *         description: Order not found
 *
 * /api/admin/orders/status:
 *   post:
 *     summary: Update order status
 *     tags: [Admin - Vendors]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - status
 *             properties:
 *               orderId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/product-landing-slider:
 *   post:
 *     summary: Update product landing page sliders
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               links:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sliders updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/product-landing-slider/{filename}:
 *   delete:
 *     summary: Delete product landing slider
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Slider image filename
 *     responses:
 *       200:
 *         description: Slider deleted
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/popular-category:
 *   post:
 *     summary: Update popular categories
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category added
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/popular-category/{id}:
 *   delete:
 *     summary: Delete popular category
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/featured-product:
 *   post:
 *     summary: Update featured product
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Featured product updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/product-banner-one:
 *   post:
 *     summary: Update product banner one
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/brand-in-spotlight:
 *   post:
 *     summary: Update brand in spotlight
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand added
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/brand-in-spotlight/{id}:
 *   delete:
 *     summary: Delete brand in spotlight
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/vet-landing-slider:
 *   post:
 *     summary: Update vet landing page sliders
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               links:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Sliders updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/vet-landing-slider/{filename}:
 *   delete:
 *     summary: Delete vet landing slider
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Slider image filename
 *     responses:
 *       200:
 *         description: Slider deleted
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/vet-grid-banners:
 *   post:
 *     summary: Update vet grid banners
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               links:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Banners updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/vet-grid-banners/{filename}:
 *   delete:
 *     summary: Delete vet grid banner
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner image filename
 *     responses:
 *       200:
 *         description: Banner deleted
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/vet-banner-one:
 *   post:
 *     summary: Update vet banner one
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/adoption-banner-one:
 *   post:
 *     summary: Update adoption banner one
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/adoption-banner-two:
 *   post:
 *     summary: Update adoption banner two
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banner updated
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/best-deals/products:
 *   post:
 *     summary: Add product to best deals
 *     tags: [Admin - Site Settings]
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
 *     responses:
 *       200:
 *         description: Product added to best deals
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/best-deals/products/{productId}:
 *   delete:
 *     summary: Remove product from best deals
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from best deals
 *       401:
 *         description: Admin not authenticated
 *
 * /api/admin/site-settings/best-deals:
 *   post:
 *     summary: Update best deals duration
 *     tags: [Admin - Site Settings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Duration updated
 *       401:
 *         description: Admin not authenticated
 */
