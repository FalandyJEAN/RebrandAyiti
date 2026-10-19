import { SignJWT, jwtVerify } from "jose"

// En production, JWT_SECRET est obligatoire (OWASP-098) : aucun secret par défaut
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
  throw new Error("JWT_SECRET manquant")
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_only_local_secret")

export interface TokenPayload {
  id: number
  email: string
  name: string
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ id: payload.id, email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization")
  if (auth?.startsWith("Bearer ")) return auth.slice(7)
  return null
}
