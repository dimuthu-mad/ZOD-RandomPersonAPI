import express from "express";
import { email, z } from "zod";
import { da } from "zod/locales";

const app = express();
app.use(express.json());
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

const personSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      gender: z.string(),
      location: z.object({
        city: z.string(),
        country: z.string(),
      }),
      email: z.email(),
    }),
  ),
});

app.get("/random-person", async (req, res) => {
  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();

  const validatedPerson = personSchema.safeParse(data);
  if (validatedPerson.success) {
    res.json(validatedPerson.data);
  } else {
    res.status(500).json({ error: "Failed to fetch random person" });
  }
});
