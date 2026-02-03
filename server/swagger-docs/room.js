/**
 * @swagger
 * /api/room/token:
 *   post:
 *     summary: Get video room access token
 *     tags: [Room]
 *     description: Generate a Twilio video room access token for video consultations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identity
 *               - roomName
 *             properties:
 *               identity:
 *                 type: string
 *                 description: User identity for the video room
 *                 example: user_12345
 *               roomName:
 *                 type: string
 *                 description: Name of the video room to join
 *                 example: appointment_room_abc123
 *     responses:
 *       200:
 *         description: Access token generated
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
 *                   description: Twilio access token for video room
 *       400:
 *         description: Missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
