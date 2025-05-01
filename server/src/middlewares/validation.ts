import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
// import { AppError } from "./error";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        errors: errors.array(),
      });
    }

    //  if (!errors.isEmpty()) {
    //    return next(new AppError("Validation failed", 400));
    //  }

    return next();
  };
};
