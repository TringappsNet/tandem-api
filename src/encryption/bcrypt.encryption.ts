import * as bcrypt from 'bcrypt';

const saltNumbers = 10;

export async function hashPassword(password: string) {
  const hash = await bcrypt.hash(password, saltNumbers).then((token) => {
    return token;
  });
  console.log(hash);
}
