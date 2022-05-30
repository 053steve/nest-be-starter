import { nanoid } from "nanoid";

export class BaseModel {

  id: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<BaseModel> = {}) {
    data.id = data.id || nanoid();
    data.createdAt = data.createdAt || new Date().toISOString();
    data.updatedAt = data.updatedAt || new Date().toISOString();
    Object.assign(this, data);
  }
}