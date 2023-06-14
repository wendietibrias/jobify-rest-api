export const jwtConstants = {
   secret:process.env.JWT_AUTH_SECRET
}

export const saltRounds = Number(process.env.BCRYPT_SALT_ROUND);