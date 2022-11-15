const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateImage(req, res) {
    const { prompt, n = 1, size = '512x512' } = req.body;
    const response = await openai.createImage({ prompt, n, size, response_format: "b64_json" });
    images = response.data.data;
    return res.json(images)
}

module.exports = app => {
    app.post('/api/generate-image', generateImage)
}