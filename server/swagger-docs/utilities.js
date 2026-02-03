/**
 * @swagger
 * /location:
 *   get:
 *     summary: Get location details from coordinates
 *     tags: [Utilities]
 *     description: Reverse geocode latitude and longitude to get city, state, and country information
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude coordinate
 *         example: 23.8103
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude coordinate
 *         example: 90.4125
 *     responses:
 *       200:
 *         description: Location details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     city:
 *                       type: string
 *                       example: Dhaka
 *                     state:
 *                       type: string
 *                       example: Dhaka Division
 *                     country:
 *                       type: string
 *                       example: Bangladesh
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: boolean
 *                       example: false
 *                   description: Location not found
 */
