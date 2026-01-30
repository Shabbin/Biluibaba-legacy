/**
 * @swagger
 * /api/vet:
 *   get:
 *     summary: Get expert vets (featured)
 *     tags: [Veterinary]
 *     responses:
 *       200:
 *         description: Expert vets retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vet'
 *
 * /api/vet/get:
 *   get:
 *     summary: Get vets by appointment type
 *     tags: [Veterinary]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [online, physical, emergency, homeService, instantChat]
 *         description: Filter by appointment type
 *     responses:
 *       200:
 *         description: Vets retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vet'
 *       421:
 *         description: Missing type parameter
 *
 * /api/vet/get/{id}:
 *   get:
 *     summary: Get vet by ID
 *     tags: [Veterinary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vet ID
 *     responses:
 *       200:
 *         description: Vet details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vet:
 *                   $ref: '#/components/schemas/Vet'
 *       404:
 *         description: Vet not found
 *
 * /api/vet/create:
 *   post:
 *     summary: Register as a veterinarian
 *     tags: [Veterinary]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - gender
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. John Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: dr.john@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+8801700000000"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               password:
 *                 type: string
 *                 format: password
 *               degree:
 *                 type: string
 *                 example: DVM
 *               license:
 *                 type: string
 *               hospital:
 *                 type: string
 *               bio:
 *                 type: string
 *               state:
 *                 type: string
 *               district:
 *                 type: string
 *               postcode:
 *                 type: string
 *               fullAddress:
 *                 type: string
 *               nidFront:
 *                 type: string
 *                 format: binary
 *               nidBack:
 *                 type: string
 *                 format: binary
 *               certificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Vet registration submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       421:
 *         description: Missing required information
 *
 * /api/vet/get-all-id:
 *   get:
 *     summary: Get all vet IDs (active vets only)
 *     tags: [Veterinary]
 *     responses:
 *       200:
 *         description: Vet IDs retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *
 * /api/vet/rating:
 *   post:
 *     summary: Submit a vet review
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vetId
 *               - rating
 *             properties:
 *               vetId:
 *                 type: string
 *               comment:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Review submitted
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Vet not found
 *
 * /api/vet/appointment/create:
 *   post:
 *     summary: Book a vet appointment
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vetId
 *               - type
 *               - date
 *               - time
 *               - petName
 *               - species
 *               - petConcern
 *               - phoneNumber
 *             properties:
 *               vetId:
 *                 type: string
 *                 description: ID of the vet
 *               type:
 *                 type: string
 *                 enum: [online, physical, emergency, homeService]
 *                 example: online
 *               date:
 *                 type: string
 *                 example: "2025-02-01"
 *               time:
 *                 type: string
 *                 example: "10:00 AM"
 *               petName:
 *                 type: string
 *                 example: Buddy
 *               species:
 *                 type: string
 *                 example: Dog
 *               age:
 *                 type: string
 *                 example: "2 years"
 *               breed:
 *                 type: string
 *                 example: Golden Retriever
 *               petConcern:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["vaccination", "checkup"]
 *               detailedConcern:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               homeAddress:
 *                 type: string
 *                 description: Required for homeService type
 *     responses:
 *       200:
 *         description: Appointment booked
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     message:
 *                       type: string
 *                     appointmentId:
 *                       type: string
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     redirectUrl:
 *                       type: string
 *                       description: Payment gateway URL
 *       401:
 *         description: User not authenticated
 *       421:
 *         description: Missing information
 *
 * /api/vet/appointment/validate:
 *   post:
 *     summary: Validate appointment payment
 *     tags: [Veterinary]
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
 * /api/vet/me:
 *   get:
 *     summary: Get current vet profile
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Vet profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vet:
 *                   $ref: '#/components/schemas/Vet'
 *       401:
 *         description: Vet not authenticated
 *
 * /api/vet/update:
 *   post:
 *     summary: Update vet profile
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               degree:
 *                 type: string
 *               hospital:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Vet not authenticated
 *
 * /api/vet/update/slot:
 *   post:
 *     summary: Update appointment slots
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *               duration:
 *                 type: string
 *                 example: "30"
 *               interval:
 *                 type: string
 *                 example: "10"
 *     responses:
 *       200:
 *         description: Slots updated
 *       401:
 *         description: Vet not authenticated
 *
 * /api/vet/update/availability:
 *   post:
 *     summary: Update service availability and fees
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               online:
 *                 type: object
 *                 properties:
 *                   fee:
 *                     type: number
 *                   status:
 *                     type: boolean
 *               physical:
 *                 type: object
 *                 properties:
 *                   fee:
 *                     type: number
 *                   status:
 *                     type: boolean
 *               emergency:
 *                 type: object
 *                 properties:
 *                   fee:
 *                     type: number
 *                   status:
 *                     type: boolean
 *               homeService:
 *                 type: object
 *                 properties:
 *                   fee:
 *                     type: number
 *                   status:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Availability updated
 *       401:
 *         description: Vet not authenticated
 *
 * /api/vet/appointments:
 *   get:
 *     summary: Get all vet appointments
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Appointments retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Vet not authenticated
 *
 * /api/vet/appointment:
 *   get:
 *     summary: Get specific appointment details
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Vet not authenticated
 *
 * /api/vet/upcoming-appointments:
 *   get:
 *     summary: Get upcoming appointments
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Upcoming appointments retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 appointments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Vet not authenticated
 *
 * /api/vet/appointment/update:
 *   post:
 *     summary: Update appointment status or add prescription
 *     tags: [Veterinary]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *             properties:
 *               appointmentId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [confirmed, completed, cancelled]
 *               prescription:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medication:
 *                       type: string
 *                     dose:
 *                       type: string
 *                     instruction:
 *                       type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       401:
 *         description: Vet not authenticated
 *       404:
 *         description: Appointment not found
 */
