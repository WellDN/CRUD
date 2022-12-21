import express from "express";

declare global {
  namespace Express {
    interface Request {
      formData: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
    }
  }
}