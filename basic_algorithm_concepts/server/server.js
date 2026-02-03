import express from "express";
import { getGameById, getRandomWordFromAPI, shareDetails } from "./gameService.js";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/gameDetails", async (req, res) => {
    try {
        const data = await getGameById();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

app.get("/api/game/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await shareDetails(id);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.toString() })
    }
})

app.get("/api/word", async (req, res) => {
    try {
        const data = await getRandomWordFromAPI();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
    }
})

app.listen(5001, () => {
    console.log("Server running on port 5001");
});