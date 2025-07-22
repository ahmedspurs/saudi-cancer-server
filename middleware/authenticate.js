const jwt = require("jsonwebtoken");

// Utility function to match routes with support for dynamic parameters
const matchRoute = (routePattern, url) => {
  const pattern = new RegExp(`^${routePattern.replace(/:[^/]+/g, "[^/]+")}$`);
  return pattern.test(url);
};

// List of public routes with method and URL
const publicRoutes = [
  { url: "/api/payments/verify?:id", method: "GET" },
  { url: "/api/payment-methods", method: "GET" },
  { url: "/api/bank-accounts", method: "GET" },
  { url: "/api/social-media-links", method: "GET" },
  { url: "/api/governance-categories", method: "GET" },
  { url: "/api/posts/:id", method: "GET" },
  { url: "/api/comprehensive-documents/paginate", method: "POST" },
  { url: "/api/organization-members/by-type", method: "POST" },
  { url: "/api/organization-members/by-type", method: "GET" },
  { url: "/api/partners", method: "GET" },
  { url: "/api/payments/user/reciept", method: "POST" },
  { url: "/api/users/login", method: "POST" },
  { url: "/api/users/admin-login", method: "POST" },
  { url: "/api/users/donor-register", method: "POST" },
  { url: "/api/payments/verify?:paymentId", method: "GET" },
  { url: "/api/payments/webhook?:id", method: "POST" },
  { url: "/api/payments/webhook", method: "POST" },
  { url: "/api/payments/moyasar", method: "POST" },
  { url: "/api/tokens/refresh-token", method: "POST" },
  { url: "/api/contact-messages", method: "POST" },
  { url: "/api/service-work/search", method: "GET" },
  { url: "/api/cases/by-type", method: "POST" },
  { url: "/api/cases/paginate", method: "POST" },
  { url: "/api/posts/by-type", method: "POST" },
  { url: "/api/posts/paginate", method: "POST" },
  { url: "/api/partners/paginate", method: "POST" },
  { url: "/api/service-work/paginate", method: "POST" },
  { url: "/api/users/login", method: "POST" },
  { url: "/api/static-sections/:id", method: "GET" },
  { url: "/api/static-sections/by-type", method: "POST" },
  { url: "/api/partners/:id", method: "GET" },
  { url: "/api/service-services/:id", method: "GET" },
  { url: "/api/service-work/:id", method: "GET" },
];

const halfPublic = [{ url: "/api/payments/checkout", method: "POST" }];

// Middleware to authenticate JWT tokens
exports.authenticate = (req, res, next) => {
  console.log({ url: req.originalUrl });

  // Check if the request matches a public route
  const isPublicRoute = publicRoutes.some(
    (route) =>
      route.method === req.method && matchRoute(route.url, req.originalUrl)
  );
  const isHalfPublic = halfPublic.some(
    (route) =>
      route.method === req.method && matchRoute(route.url, req.originalUrl)
  );

  if (isPublicRoute) {
    return next();
  }

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (isHalfPublic) {
      return next();
    } else {
      return res.status(401).json({
        status: false,
        message: "Authentication token is required",
      });
    }
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Invalid token format",
    });
  }

  console.log({ token });

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret"
    );

    console.log({ decoded });

    // Validate decoded payload
    if (!decoded.id || !decoded.iat || !decoded.exp) {
      throw new Error("Invalid token payload");
    }

    // Attach user data to request
    req.user = {
      id: decoded.id,
      // Add other necessary fields from decoded token
      // e.g., role: decoded.role
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", {
      error: error.message,
      stack: error.stack,
    });

    // Handle specific JWT errors
    let message = "Invalid or expired token. Please log in again.";
    if (error.name === "TokenExpiredError") {
      message = "Token has expired. Please log in again.";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token. Please log in again.";
    }

    return res.status(401).json({
      status: false,
      message,
    });
  }
};

// Utility to check if a route is public (for external use if needed)
exports.isPublicRoute = (method, url) => {
  return publicRoutes.some(
    (route) => route.method === method && matchRoute(route.url, url)
  );
};
