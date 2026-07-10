import mongoose, { Document, Schema, Types } from "mongoose";

// --- USER MODEL ---
export interface ICookbookUser extends Document {
  username: string;
  passwordHash: string;
  avatar?: string; // Optional because new users won't have one yet
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
        avatar: {
            type: String,
            default: null, // Default to null until they upload a PFP
        }
    },
    {
        timestamps: true,
    }
);

export const CookbookUser = mongoose.model<ICookbookUser>('CookbookUser', CookbookUserSchema);


// --- RECIPE MODEL ---
export interface IRecipe extends Document {
  title: string;
  description: string;
  time: string;
  category: string;
  imageUrl: string;
  authorId: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true }, 
  authorId: { type: Schema.Types.ObjectId, ref: "CookbookUser", required: true }, 
}, { 
  timestamps: true 
});

export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);