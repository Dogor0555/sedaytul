import "next-auth";

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "EDITOR";
  }

  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EDITOR";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "EDITOR";
  }
}
