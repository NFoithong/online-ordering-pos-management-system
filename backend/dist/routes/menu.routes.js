"use strict";
// src/routes/menu.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const menuData_1 = __importDefault(require("../data/menuData"));
const router = (0, express_1.Router)();
// GET all
router.get('/', (req, res) => {
    res.json(menuData_1.default);
});
// GET by id
// router.get('/:id', (req: Request, res: Response) => {
//   const item = menuData.find(i => i.id === req.params.id);
//   if (!item) return res.status(404).json({ message: 'Not found' });
//   res.json(item);
// });
// POST create
router.post('/', (req, res) => {
    const newItem = {
        id: (0, uuid_1.v4)(),
        ...req.body
    };
    menuData_1.default.push(newItem);
    res.status(201).json(newItem);
});
// PUT update
// router.put('/:id', (req: Request, res: Response) => {
//   const idx = menuData.findIndex(i => i.id === req.params.id);
//   if (idx === -1) return res.status(404).json({ message: 'Not found' });
//   menuData[idx] = { ...menuData[idx], ...req.body };
//   res.json(menuData[idx]);
// });
// DELETE
// router.delete('/:id', (req: Request, res: Response) => {
//   const idx = menuData.findIndex(i => i.id === req.params.id);
//   if (idx === -1) return res.status(404).json({ message: 'Not found' });
//   menuData.splice(idx, 1);
//   res.status(204).send();
// });
exports.default = router;
