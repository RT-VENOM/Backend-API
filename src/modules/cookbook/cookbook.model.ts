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