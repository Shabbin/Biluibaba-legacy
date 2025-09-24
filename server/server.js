require("dotenv").config();

const logger = require("coders-logger");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

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

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/product", require("./routes/product"));
app.use("/api/order", require("./routes/order"));
app.use("/api/app", require("./routes/app"));
app.use("/api/vendor", require("./routes/vendor"));
app.use("/api/vet", require("./routes/vet"));
app.use("/api/adoptions", require("./routes/adoptions"));
app.use("/api/admin", require("./routes/admin"));

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
