import { Document } from 'mongoose';

export class IUser extends Document {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}
