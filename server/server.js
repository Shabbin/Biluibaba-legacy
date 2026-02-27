require("dotenv").config();

const logger = require("coders-logger");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Validate SSLCommerz Configuration
console.log("\n==============================================");
console.log("SSLCommerz Configuration Check");
console.log("==============================================");
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`SSLCommerz Mode: ${process.env.SSLCOMMERZ_IS_LIVE === 'true' ? 'PRODUCTION ✓' : 'SANDBOX ⚠️'}`);
console.log(`Store ID: ${process.env.SSLCOMMERZ_STORE_ID}`);
console.log(`API Key: ${process.env.SSLCOMMERZ_API_KEY ? '***' + process.env.SSLCOMMERZ_API_KEY.slice(-4) : 'NOT SET'}`);
console.log(`Backend URL: ${process.env.BACKEND_URL}`);
console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);

// Validate required environment variables
const requiredEnvVars = [
  'SSLCOMMERZ_STORE_ID',
  'SSLCOMMERZ_API_KEY',
  'SSLCOMMERZ_IS_LIVE',
  'BACKEND_URL',
  'FRONTEND_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`\n❌ ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
  console.log("==============================================\n");
  process.exit(1);
}

if (process.env.SSLCOMMERZ_IS_LIVE === 'true') {
  console.log("\n⚠️  WARNING: SSLCommerz is in PRODUCTION mode!");
  console.log("   Real transactions will be processed.");
  console.log("   Ensure you have valid production credentials.");
}
console.log("==============================================\n");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.CORS_ORIGIN,
      process.env.APP_CORS_ORIGIN,
      process.env.ADMIN_CORS_ORIGIN,
      process.env.ROOM_CORS_ORIGIN,
    ],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Static folders
app.use("/uploads/profile", express.static("./uploads/profile"));
app.use("/uploads/product", express.static("./uploads/product"));
app.use("/uploads/adoptions", express.static("./uploads/adoptions"));
app.use("/uploads/site-settings", express.static("./uploads/site-settings"));
app.use("/uploads/logo", express.static("./uploads/logo.png"));
app.use("/uploads/vendor", express.static("./uploads/vendor"));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Biluibaba API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
      filter: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  })
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecs);
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/product", require("./routes/product"));
app.use("/api/order", require("./routes/order"));
app.use("/api/app", require("./routes/app"));
app.use("/api/vendor", require("./routes/vendor"));
app.use("/api/vet", require("./routes/vet"));
app.use("/api/room", require("./routes/room"));
app.use("/api/adoptions", require("./routes/adoptions"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/contact", require("./routes/contact"));

app.get("/location", async (request, response) => {
  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${request.query.lat}+${request.query.lng}&key=${process.env.OPENCAGE_API_KEY}`
  );

  const data = await res.json();

  if (data.results.length > 1) {
    const components = data.results[0].components;
    console.log(components);
    return response.status(200).json({
      city: components.city || components.town || components.village,
      state: components.state,
      country: components.country,
    });
  }

  return response.status(200).json({ message: false });
});

// Error handler
app.use(errorHandler);

// Server
const server = app.listen(process.env.PORT, () =>
  logger.success(`Server is running on port ${process.env.PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  logger.error(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
