export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type UIModel = {
  model_ref: string;
  prediction?: string;
  metadata?: string;
  performance?: string;
};
