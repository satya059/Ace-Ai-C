import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // First, try to find user by clerkUserId
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;
    const email = user.emailAddresses[0].emailAddress;

    // Check if a user with this email already exists (from a previous account)
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUserByEmail) {
      // Update the existing user with the new clerkUserId
      const updatedUser = await db.user.update({
        where: {
          email: email,
        },
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
        },
      });
      return updatedUser;
    }

    // No existing user found, create a new one
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: email,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
    throw error; // Re-throw to properly propagate the error
  }
};
