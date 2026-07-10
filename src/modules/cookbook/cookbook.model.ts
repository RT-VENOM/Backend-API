import mongoose, { Document, Schema } from "mongoose";

export interface ICookbookUser extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}



const CookbookUserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            lowercase: true
        },
        passwordHash:{
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


export const CookbookUser = mongoose.model<ICookbookUser>('CookbookUser', CookbookUserSchema)



const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Cloudinary link goes here
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "CookbookUser", required: true }, // Links recipe to the user
}, { timestamps: true });

export const Recipe = mongoose.model("Recipe", recipeSchema);

