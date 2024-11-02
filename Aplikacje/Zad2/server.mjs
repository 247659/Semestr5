import express from 'express';
import path from 'path';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: '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' });



const app = express();

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());

const categorySchema = {
    type: "object",
    properties: {
        title: { title: "Name", type: "string" },
        description: { title: "Opis", type: "string" },
        category: { title: "Kategoria", type: "string", enum: ["uczelnia", "praca", "prywatne"] }
    }
};

export async function categorizeTask(title, description) {
    const jsonSchema = JSON.stringify(categorySchema, null, 4);

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a categorization model that categorizes tasks into one of three categories: 'uczelnia', 'praca', or 'prywatne'. The input must conform to the following json schema: ${jsonSchema}. The output should be in json format.` 
                },
                {
                    role: "user",
                    content: `Categorize the following task: Title: ${title}, Description: ${description} Please respond with the result in JSON format. Ensure your output contains valid JSON.`,
                },
            ],
            model: "llama3-8b-8192",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(chatCompletion.choices[0].message.content);
        return result.category;
    } catch (error) {
        console.error("Błąd w funkcji categorizeTask:", error);
    }
}

app.post('/api/categorize', async (req, res) => {
    const { title, description } = req.body;

    try {
        const category = await categorizeTask(title, description);
        res.json({ category });
    } catch (error) {
        console.error('Błąd w endpointzie /api/categorize:', error);
        res.status(500).json({ error: 'Nie udało się skategoryzować zadania' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
  });

app.listen(3000, () => {
    console.log("App listening on port 3000");
})