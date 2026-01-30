const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Biluibaba API Documentation",
      version: "1.0.0",
      description: `
# Biluibaba Backend API

A comprehensive e-commerce and pet services platform API.

## Overview
This API provides endpoints for:
- **Authentication** - User registration, login, and session management
- **Products** - Product browsing, search, and management
- **Orders** - Order creation and management
- **Vendors** - Vendor registration and product management
- **Veterinary Services** - Vet appointments and consultations
- **Pet Adoptions** - Pet adoption listings and applications
- **Admin** - Administrative functions and site settings

## Authentication
Most endpoints require authentication via JWT tokens stored in cookies.

### User Types:
- **User** - Regular customers
- **Vendor** - Product sellers
- **Vet** - Veterinary professionals
- **Admin** - System administrators
      `,
      contact: {
        name: "API Support",
        email: "support@biluibaba.com",
      },
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Development server",
        variables: {
          port: {
            default: "5000",
          },
        },
      },
      {
        url: "https://api.biluibaba.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and profile management",
      },
      {
        name: "Products",
        description: "Product browsing, search, and management",
      },
      {
        name: "Orders",
        description: "Order creation and management",
      },
      {
        name: "Vendors",
        description: "Vendor registration and operations",
      },
      {
        name: "Veterinary",
        description: "Veterinary services and appointments",
      },
      {
        name: "Adoptions",
        description: "Pet adoption listings and applications",
      },
      {
        name: "App",
        description: "Application-level authentication",
      },
      {
        name: "Room",
        description: "Video room access tokens",
      },
      {
        name: "Admin",
        description: "Administrative operations",
      },
      {
        name: "Admin - Users",
        description: "User management by admin",
      },
      {
        name: "Admin - Vendors",
        description: "Vendor management by admin",
      },
      {
        name: "Admin - Adoptions",
        description: "Adoption management by admin",
      },
      {
        name: "Admin - Site Settings",
        description: "Site configuration and settings",
      },
      {
        name: "Utilities",
        description: "Utility endpoints like geolocation",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token stored in cookie",
        },
      },
      schemas: {
        // User Schema
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            phoneNumber: { type: "string", example: "+8801700000000" },
            avatar: {
              type: "string",
              example: "http://localhost:5000/uploads/profile/default.jpg",
            },
            authType: {
              type: "string",
              enum: ["traditional", "google", "facebook"],
            },
            verified: { type: "boolean" },
            package: {
              type: "string",
              enum: ["free", "premium"],
              example: "free",
            },
            shipping: {
              type: "object",
              properties: {
                state: { type: "string" },
                area: { type: "string" },
                district: { type: "string" },
                postcode: { type: "string" },
                address: { type: "string" },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // Product Schema
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            productId: { type: "string" },
            name: { type: "string", example: "Premium Dog Food" },
            slug: { type: "string", example: "premium-dog-food" },
            description: { type: "string" },
            price: { type: "number", example: 1500 },
            discount: { type: "number", example: 10 },
            quantity: { type: "number", example: 100 },
            size: { type: "number" },
            status: { type: "boolean", default: true },
            featured: { type: "boolean", default: false },
            categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  parent: { type: "string", example: "dog" },
                  category: { type: "string", example: "food" },
                  sub: { type: "string", example: "dry-food" },
                },
              },
            },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  filename: { type: "string" },
                  path: { type: "string" },
                },
              },
            },
            tags: { type: "array", items: { type: "string" } },
            ratings: { type: "number", default: 0 },
            totalRatings: { type: "number", default: 0 },
            totalReviews: { type: "number", default: 0 },
            ratingBreakdown: {
              type: "object",
              properties: {
                excellent: { type: "number" },
                veryGood: { type: "number" },
                good: { type: "number" },
                average: { type: "number" },
                poor: { type: "number" },
              },
            },
            reviews: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  comment: { type: "string" },
                  rating: { type: "number", minimum: 1, maximum: 5 },
                  date: { type: "string", format: "date-time" },
                },
              },
            },
            vendorId: { type: "string" },
            vendorName: { type: "string" },
            views: { type: "number", default: 0 },
            orderCount: { type: "string" },
          },
        },

        // Order Schema
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            orderId: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  quantity: { type: "number" },
                  price: { type: "number" },
                  vendor: { type: "string" },
                },
              },
            },
            totalAmount: { type: "number" },
            shippingCost: { type: "number" },
            paymentMethod: { type: "string", enum: ["COD", "Online"] },
            paymentStatus: { type: "boolean" },
            deliveryStatus: { type: "string" },
            userId: { type: "string" },
            name: { type: "string" },
            phoneNumber: { type: "string" },
            region: { type: "string" },
            area: { type: "string" },
            fullAddress: { type: "string" },
            notes: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // Vendor Schema
        Vendor: {
          type: "object",
          properties: {
            _id: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
            },
            name: { type: "string" },
            type: { type: "string", enum: ["Individual", "Company"] },
            phoneNumber: { type: "string" },
            email: { type: "string", format: "email" },
            storeName: { type: "string" },
            verified: { type: "boolean" },
            address: {
              type: "object",
              properties: {
                store: { type: "string" },
                state: { type: "string" },
                area: { type: "string" },
                district: { type: "string" },
                postcode: { type: "string" },
                fullAddress: { type: "string" },
                pickupAddress: { type: "string" },
              },
            },
            nid: {
              type: "object",
              properties: {
                front: { type: "string" },
                back: { type: "string" },
                number: { type: "string" },
              },
            },
            bank: {
              type: "object",
              properties: {
                accountType: { type: "string" },
                accountName: { type: "string" },
                accountNumber: { type: "string" },
              },
            },
            ratings: { type: "number", default: 0 },
            totalListedProducts: { type: "number" },
          },
        },

        // Vet Schema
        Vet: {
          type: "object",
          properties: {
            _id: { type: "string" },
            status: { type: "boolean" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phoneNumber: { type: "string" },
            gender: { type: "string", enum: ["male", "female", "other"] },
            degree: { type: "string" },
            license: { type: "string" },
            hospital: { type: "string" },
            bio: { type: "string" },
            profilePicture: { type: "string" },
            address: {
              type: "object",
              properties: {
                state: { type: "string" },
                district: { type: "string" },
                postcode: { type: "string" },
                fullAddress: { type: "string" },
              },
            },
            appointments: {
              type: "object",
              properties: {
                slots: {
                  type: "object",
                  description: "Weekly appointment slots",
                },
                online: {
                  type: "object",
                  properties: {
                    fee: { type: "number" },
                    status: { type: "boolean" },
                  },
                },
                physical: {
                  type: "object",
                  properties: {
                    fee: { type: "number" },
                    status: { type: "boolean" },
                  },
                },
                emergency: {
                  type: "object",
                  properties: {
                    fee: { type: "number" },
                    status: { type: "boolean" },
                  },
                },
                homeService: {
                  type: "object",
                  properties: {
                    fee: { type: "number" },
                    status: { type: "boolean" },
                  },
                },
              },
            },
            specializedZone: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pet: { type: "string" },
                  concerns: { type: "array", items: { type: "string" } },
                },
              },
            },
            ratings: { type: "number" },
            totalRatings: { type: "number" },
            totalReviews: { type: "number" },
          },
        },

        // Appointment Schema
        Appointment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            appointmentId: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "completed", "cancelled"],
            },
            phoneNumber: { type: "string" },
            petName: { type: "string" },
            petConcern: { type: "array", items: { type: "string" } },
            detailedConcern: { type: "string" },
            species: { type: "string" },
            age: { type: "string" },
            breed: { type: "string" },
            date: { type: "string" },
            time: { type: "string" },
            totalAmount: { type: "number" },
            paymentStatus: { type: "boolean" },
            type: {
              type: "string",
              enum: ["online", "physical", "emergency", "homeService"],
            },
            homeAddress: { type: "string" },
            roomLink: { type: "string" },
            prescription: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  medication: { type: "string" },
                  dose: { type: "string" },
                  instruction: { type: "string" },
                },
              },
            },
            vet: { type: "string" },
            user: { type: "string" },
          },
        },

        // Adoption Schema
        Adoption: {
          type: "object",
          properties: {
            _id: { type: "string" },
            adoptionId: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "approved", "adopted", "rejected"],
            },
            name: { type: "string", example: "Buddy" },
            species: { type: "string", example: "Dog" },
            gender: { type: "string", enum: ["male", "female"] },
            age: { type: "string", example: "2 years" },
            breed: { type: "string", example: "Golden Retriever" },
            size: { type: "string", enum: ["small", "medium", "large"] },
            vaccinated: { type: "string", enum: ["yes", "no"] },
            neutered: { type: "string", enum: ["yes", "no"] },
            color: { type: "array", items: { type: "string" } },
            location: { type: "string" },
            description: { type: "string" },
            phoneNumber: { type: "string" },
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  filename: { type: "string" },
                  path: { type: "string" },
                },
              },
            },
            userId: { type: "string" },
          },
        },

        // Adoption Order Schema
        AdoptionOrder: {
          type: "object",
          properties: {
            _id: { type: "string" },
            orderId: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
            },
            payment: { type: "number" },
            name: { type: "string" },
            phoneNumber: { type: "string" },
            area: { type: "string" },
            address: { type: "string" },
            whyAdopt: { type: "string" },
            petProof: { type: "string" },
            takeCareOfPet: { type: "string" },
            userId: { type: "string" },
            adoptionId: { type: "string" },
          },
        },

        // Error Response
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string" },
          },
        },

        // Success Response
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./swagger-docs/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
