
/*************************Imports******************** */
import firebase from "firebase/app";
import "firebase/storage";
import { firebaseConfig } from "../Config/App";

/*************************Script******************** */

//Initializing the firebase app
firebase.initializeApp(firebaseConfig); 

//Getting reference to the Profile Pictures folder
const profilePicturesStorageRef : firebase.storage.Reference = firebase.storage().ref().child("Profile Pictures");

/*************************Exports******************** */
export {profilePicturesStorageRef};