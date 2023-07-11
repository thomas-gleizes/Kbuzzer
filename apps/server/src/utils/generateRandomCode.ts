export function generateRandomCode(bannedCode: Set<string>, length: number = 5) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""

  for (let i = 0; i < length; i++)
    code += characters.charAt(Math.floor(Math.random() * characters.length))

  if (bannedCode.has(code)) return generateRandomCode(bannedCode)

  return code
}
