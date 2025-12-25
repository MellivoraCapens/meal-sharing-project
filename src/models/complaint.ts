import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";

const ComplaintSchema = new Schema(
  {
    title: {
      type: String,
    },
    subjectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reportedById: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    assignedToId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "User",
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_review", "resolved", "rejected"],
      default: "pending",
    },
    assignedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export type ComplaintSchemaType = InferSchemaType<typeof ComplaintSchema>;
export type IComplaint = HydratedDocument<ComplaintSchemaType>;

ComplaintSchema.pre("save", function (next) {
  if (this.isModified("assignedToId") && this.assignedToId) {
    this.assignedAt = new Date();
  }
  next();
});

export default mongoose.model<IComplaint>("Complaint", ComplaintSchema);
