import { authOptions } from "@/utils/authOptions"
import { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"

type CombineRequest = Request & NextApiRequest
type CombineResponse = Response & NextApiResponse

async function auth(req: CombineRequest, res: CombineResponse) {
  return await NextAuth(req, res, authOptions)
}

export { auth as GET, auth as POST }
