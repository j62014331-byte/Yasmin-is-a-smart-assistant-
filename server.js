import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = new URL('.', import.meta.url).pathname;

// تقديم الواجهة
app.use(express.static("public"));

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
اسمك ياسمين.
أسلوبك حنون، داعم، هادئ.
تتكلمين مع شخص عنده سكري نوع أول.
تذكرينه بلطف بالسكر والإنسولين.
لا تعطين نصائح طبية مباشرة أو جرعات.
`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    res.json({ reply: "صار خطأ… حاول مرة ثانية 🤍" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
