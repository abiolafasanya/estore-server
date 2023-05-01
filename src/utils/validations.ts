import Joi from 'joi';

const validation = (user: any) => {
  const UserSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(15).required(),
    confirmPassword: Joi.ref('password'),
  }).unknown();

  return UserSchema.validate(user);
};

export default validation;
