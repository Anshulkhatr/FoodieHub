const OpenAI = require('openai');

const generateDescription = async (req, res) => {
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Name and Category are required' });
  }

  try {
    const client = new OpenAI({
      baseURL: process.env.NVIDIA_BASE_URL,
      apiKey: process.env.NVIDIA_API_KEY
    });

    const prompt = `Write a mouth-watering 2-sentence menu description for a dish called ${name} in the ${category} category.`;

    const completion = await client.chat.completions.create({
      model: "qwen/qwen3-next-80b-a3b-instruct",
      messages: [
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 256, // Descriptions should be short
    });

    const description = completion.choices[0].message.content.trim();
    res.json({ description });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate description', 
      error: error.message 
    });
  }
};

const getOrderStatusAI = async (req, res) => {
  const { status, ageInMinutes } = req.body;

  try {
    const client = new OpenAI({
      baseURL: process.env.NVIDIA_BASE_URL,
      apiKey: process.env.NVIDIA_API_KEY
    });

    const prompt = `Write a short, professional, and comforting AI status update for a restaurant order. 
      Current Status: ${status}. 
      Time elapsed: ${Math.floor(ageInMinutes)} minutes. 
      Limit to 15-20 words. Make it sound helpful and friendly.`;

    const completion = await client.chat.completions.create({
      model: "qwen/qwen3-next-80b-a3b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const update = completion.choices[0].message.content.trim();
    res.json({ update });
  } catch (error) {
    console.error('AI Status Error:', error);
    res.status(500).json({ message: 'Failed to generate status update' });
  }
};

module.exports = { generateDescription, getOrderStatusAI };
