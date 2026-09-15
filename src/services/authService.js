import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./firebase";

export const loginAdmin = async (
  email,
  password
) => {
  try {
    const result =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    return result.user;
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async () => {
  await signOut(auth);
};

export const listenToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};