"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const ConvertHoursToMinutes_1 = require("./utils/ConvertHoursToMinutes");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/games", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultado = yield prisma.game.findMany({
        include: {
            _count: {
                select: { ads: true },
            },
        },
    });
    res.json({ resultado });
}));
app.post("/games/:id/ads", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = request.params.id;
    const body = request.body;
    const ad = yield prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays,
            hourStart: (0, ConvertHoursToMinutes_1.ConvertHoursToMinutes)(body.hoursStart),
            hourEnd: (0, ConvertHoursToMinutes_1.ConvertHoursToMinutes)(body.hoursEnd),
            useVoiceChannel: body.useVoiceChanel,
        },
    });
    return response.status(201).json(ad);
}));
app.get("/games/:id/ads", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = req.params.id;
    const responde = yield prisma.ad.findMany({
        where: { gameId },
        select: {
            game: true,
            hourEnd: true,
            id: true,
            hourStart: true,
            name: true,
            weekDays: true,
            yearsPlaying: true,
        },
    });
    res.json(responde.map((ad) => {
        return Object.assign(Object.assign({}, responde), { weekDays: ad.weekDays.split(",") });
    }));
}));
app.get("/ads/:id/discord", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = req.params.id;
    const response = yield prisma.ad.findFirstOrThrow({
        select: { discord: true },
        where: { gameId },
    });
    res.json(response);
}));
app.listen(5555);
