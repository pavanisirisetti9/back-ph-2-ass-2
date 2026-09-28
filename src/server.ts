import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import productsRouter from "./routes/products";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import logger from "./utils/logger";

const app = express();

// JSON body parser
app.use(express.json());

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

// HTTP request logging
app.use(
  morgan("dev", {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  })
);

// Home route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Product Catalog API is running",
  });
});

// Products API
app.use("/api/v1/products", productsRouter);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

