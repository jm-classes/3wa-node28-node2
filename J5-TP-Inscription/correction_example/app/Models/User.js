import mongoose from 'mongoose';
import { sha256 } from '../utils/utils.js';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.static('createUser', createUser);
UserSchema.static('checkUserCredentials', checkUserCredentials);

async function createUser(firstName, lastName, email, password, passwordConfirm) {
  const errors = [];

  // Fields check
  if (!firstName || firstName.toString().trim() === '') errors.push(`Le champs "firstName" est requis.`);
  if (!lastName || lastName.toString().trim() === '') errors.push(`Le champs "lastName" est requis.`);
  if (!email || email.toString().trim() === '') errors.push(`Le champs "email" est requis.`);
  if (!password || password.toString().trim() === '') errors.push(`Le champs "password" est requis.`);
  if (!passwordConfirm || passwordConfirm.toString().trim() === '')
    errors.push(`Le champs "passwordConfirm" est requis.`);

  if (errors.length > 0) {
    throw new Error(errors.join('<br>'));
  }

  // Passwords compare
  if (password !== passwordConfirm) {
    throw new Error('Les mots de passe doivent correspondre');
  }

  // Check if user exists
  const existingUser = await this.findOne({ email });
  if (existingUser !== null) {
    throw new Error('Un utilisateur existe déjà avec cette adresse email');
  }

  // Hash password
  const passwordHash = sha256(password);

  return await this.create({
    firstName,
    lastName,
    email,
    password: passwordHash,
  });
}

async function checkUserCredentials(email, password) {
  const user = await this.findOne({ email, password: sha256(password) });

  if (!user) throw new Error(`Identifiants invalides ou utilisateur inexistant`);

  return user;
}

const collectionName = 'users';
export const UserModel = mongoose.model('User', UserSchema, collectionName);
