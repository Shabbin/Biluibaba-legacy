/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a product order
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalAmount
 *               - product
 *               - shippingCost
 *               - name
 *               - phoneNumber
 *               - region
 *               - area
 *               - fullAddress
 *               - paymentMethod
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 description: Total order amount
 *                 example: 2500
 *               product:
 *                 type: array
 *                 description: Array of products in the order
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Product ID
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     vendorId:
 *                       type: string
 *                     price:
 *                       type: number
 *               shippingCost:
 *                 type: number
 *                 example: 100
 *               name:
 *                 type: string
 *                 description: Customer name
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+8801700000000"
 *               region:
 *                 type: string
 *                 example: Dhaka
 *               area:
 *                 type: string
 *                 example: Mirpur
 *               fullAddress:
 *                 type: string
 *                 example: House 10, Road 5, Block A
 *               notes:
 *                 type: string
 *                 description: Additional delivery notes
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, Online]
 *                 example: COD
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: COD order response
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: Order placed successfully
 *                     orderId:
 *                       type: string
 *                 - type: object
 *                   description: Online payment response
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     redirectUrl:
 *                       type: string
 *                       description: Payment gateway URL
 *       401:
 *         description: User not authenticated
 *       421:
 *         description: Missing required information
 *
 * /api/order/validate:
 *   post:
 *     summary: Validate online payment for order
 *     tags: [Orders]
 *     description: Callback endpoint for payment gateway to validate payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               val_id:
 *                 type: string
 *                 description: Validation ID from payment gateway
 *               tran_id:
 *                 type: string
 *                 description: Transaction ID (order ID)
 *               status:
 *                 type: string
 *                 description: Payment status
 *     responses:
 *       302:
 *         description: Redirect to success or failure page
 *       400:
 *         description: Payment validation failed
 */
