# How to Add Avatars

This project allows you to use your own custom avatars for user profiles.

1.  Rename this folder from `avatars.example` to `avatars`.
2.  Place your avatar images (e.g., `.png`, `.jpg`) inside the new `public/avatars/` folder.
3.  Open the file at `src/components/ProfilePictureSelector/AvatarIcons.jsx`.
4.  Update the `avatarPaths` array to list the exact file names of the images you just added.

The application will then automatically display your custom avatars in the profile picture selector.