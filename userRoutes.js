import { Router } from "express";
const weatherRouter = Router();

weatherRouter.get("/:name", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.params.name}&appid=${process.env.API_KEY}`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      error: "error in fetching api/weather/location",
    });
  }
});

export default weatherRouter;
