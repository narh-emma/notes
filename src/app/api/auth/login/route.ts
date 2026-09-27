import connectToDatabase from "@/src/lib/db";
import User from "@/src/lib/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return Response.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const response = Response.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`
    );

    return response;
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error has occured" }, { status: 500 });
  }
}