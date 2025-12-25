import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";

const OrderSchema = new Schema(
  {
    dishId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Dish",
    },
    cookId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    orderedById: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
    },
    note: {
      type: String,
      default: "",
    },
    servingCount: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;
export type IOrder = HydratedDocument<OrderSchemaType>;
