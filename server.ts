import express from "express";
import { title } from "node:process";
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
        title: z.string(),
        first: z.string(),
        last: z.string(),
      }),
      location: z.object({
        country: z.string(),
      }),
    }),
  ),
});

app.get("/random-person", async (req, res) => {
  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();

  const validatedPerson = personSchema.safeParse(data);
  if (validatedPerson.success) {
    // res.json(validatedPerson.data);
    res.status(200).json({
      Person_Details: `${validatedPerson.data.results[0].name.title} ${validatedPerson.data.results[0].name.first} ${validatedPerson.data.results[0].name.last} from ${validatedPerson.data.results[0].location.country}`,
    });
  } else {
    res.status(500).json({ error: "Failed to fetch random person" });
  }
});

app.post("/users", (req, res) => {
  const userSchema = z.object({
    name: z.string().max(12).min(3),
    age: z.number().min(18).max(100).default(28),
    email: z.email().lowercase(),
  });
  const userValidation = userSchema.safeParse(req.body);
  if (userValidation.success) {
    res.status(201).json({
      message: "User created successfully",
      user: userValidation.data,
    });
  } else {
    res.status(400).json({
      error: "Invalid user data",
      details: userValidation.error,
    });
  }
});
