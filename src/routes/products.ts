import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import AppError from "../utils/AppError";
import asyncHandler from "../middleware/asyncHandler";

const router = Router();

let products = [
  {
    id: 1,
    name: "Laptop",
    price: 50000,
  },
  {
    id: 2,
    name: "Mobile Phone",
    price: 20000,
  },
];

// Validation and sanitization
const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .escape(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
];

// GET all products
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: products,
    });
  })
);

// GET product by ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const product = products.find((item) => item.id === id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  })
);

// POST - Create product
router.post(
  "/",
  productValidation,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 422);
    }

    const { name, price } = req.body;

    const newProduct = {
      id: products.length + 1,
      name,
      price,
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  })
);

// PUT - Update product
router.put(
  "/:id",
  productValidation,
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const product = products.find((item) => item.id === id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 422);
    }

    const { name, price } = req.body;

    product.name = name;
    product.price = price;

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  })
);

// DELETE - Delete product
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const index = products.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      throw new AppError("Product not found", 404);
    }

    products.splice(index, 1);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  })
);

export default router;
