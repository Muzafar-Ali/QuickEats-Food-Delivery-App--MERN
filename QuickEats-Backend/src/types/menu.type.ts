export type TMenu = {
  // _id:mongoose.Schema.Types.ObjectId;
  name:string;
  description:string;
  price:number;
  image:string;
}

export type TMenuDocument = TMenu & Document & {
  createdAt:Date;
  updatedAt:Date;
}