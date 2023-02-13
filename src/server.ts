import express from "express";
import { PrismaClient } from "@prisma/client";
import { ConvertHoursToMinutes } from "./utils/ConvertHoursToMinutes";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.get("/games", async (req, res) => {
  const resultado = await prisma.game.findMany({
    include: {
      _count: {
        select: { ads: true },
      },
    },
  });

  res.json({ resultado });
});

app.post("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;
  const body: any = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays,
      startDay: body.startDay,
      hoursStart: ConvertHoursToMinutes(body.hoursStart),
      hoursEnd: ConvertHoursToMinutes(body.hoursEnd),
      useVoiceChanel: body.useVoiceChanel,
    },
  });

  return response.status(201).json(ad);
});

app.get("/games/:id/ads", async (req, res) => {
  const gameId = req.params.id;

  const responde = await prisma.ad.findMany({
    where: { gameId },
    select: {
      game: true,
      hoursEnd: true,
      id: true,
      startDay: true,
      name: true,
      weekDays: true,
      yearsPlaying: true,
    },
  });

  res.json(
    responde.map((ad) => {
      return {
        ...responde,
        weekDays: ad.weekDays.split(","),
      };
    })
  );
});

app.get("/ads/:id/discord", async (req, res) => {
  const gameId = req.params.id;

  const response = await prisma.ad.findFirstOrThrow({
    select: { discord: true },
    where: { gameId },
  });

  res.json(response);
});

app.listen(3000);
