import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";

const DishSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    cookId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    servings: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["preparing", "ready"],
    },
    imgUrl: {
      type: String,
      default: null,
    },
    availableServings: {
      type: Number,
    },
  },
  { timestamps: true }
);

export type DishSchemaType = InferSchemaType<typeof DishSchema>;
export type IDish = HydratedDocument<DishSchemaType>;

DishSchema.pre("validate", function (next) {
  if (this.servings) {
    this.availableServings ??= this.servings;
  }

  next();
});

export default mongoose.model<IDish>("Dish", DishSchema);
