import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { 
  Rotate3d, 
  Layers, 
  Syringe, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  X,
  Crosshair,
  Sliders
} from 'lucide-react';

export interface ToothDetails {
  num: number;
  fdi: string;
  nameUk: string;
  nameLa: string;
  jaw: 'upper' | 'lower';
  type: 'molar' | 'premolar' | 'canine' | 'incisor';
  rootsCount: number;
  canalsCount: number;
  innervation: string;
  anesthesiaRequired: string;
  isNumbByDefault: boolean;
}

export const ALL_32_TEETH: Record<number, ToothDetails> = {
  // --- ВЕРХНЯ ЩЕЛЕПА ПРАВОРУЧ (КВАДРАНТ 1) ---
  18: {
    num: 18, fdi: '1.8', nameUk: 'Верхній правий 3-й моляр (Зуб мудрості)', nameLa: 'Dens molaris tertius superior dexter',
    jaw: 'upper', type: 'molar', rootsCount: 3, canalsCount: 3,
    innervation: 'Rami alveolares superiores posteriores, n. palatinus major',
    anesthesiaRequired: 'Туберальна + піднебінна анестезія', isNumbByDefault: false
  },
  17: {
    num: 17, fdi: '1.7', nameUk: 'Верхній правий 2-й моляр', nameLa: 'Dens molaris secundus superior dexter',
    jaw: 'upper', type: 'molar', rootsCount: 3, canalsCount: 3,
    innervation: 'Rami alveolares superiores posteriores, n. palatinus major',
    anesthesiaRequired: 'Туберальна + піднебінна анестезія', isNumbByDefault: false
  },
  16: {
    num: 16, fdi: '1.6', nameUk: 'Верхній правий 1-й моляр (Шістка)', nameLa: 'Dens molaris primus superior dexter',
    jaw: 'upper', type: 'molar', rootsCount: 3, canalsCount: 4,
    innervation: 'Rami alveolares superiores posteriores (дистальні корені) + medii (медіально-щічний корінь) + n. palatinus major',
    anesthesiaRequired: 'Туберальна + інфільтрація по щоці + піднебінна анестезія', isNumbByDefault: false
  },
  15: {
    num: 15, fdi: '1.5', nameUk: 'Верхній правий 2-й премоляр', nameLa: 'Dens praemolaris secundus superior dexter',
    jaw: 'upper', type: 'premolar', rootsCount: 1, canalsCount: 1,
    innervation: 'Ramus alveolaris superior medius, n. palatinus major',
    anesthesiaRequired: 'Інфільтраційна вестибулярно + піднебінна', isNumbByDefault: false
  },
  14: {
    num: 14, fdi: '1.4', nameUk: 'Верхній правий 1-й премоляр', nameLa: 'Dens praemolaris primus superior dexter',
    jaw: 'upper', type: 'premolar', rootsCount: 2, canalsCount: 2,
    innervation: 'Ramus alveolaris superior medius, n. palatinus major',
    anesthesiaRequired: 'Інфільтраційна вестибулярно + піднебінна', isNumbByDefault: false
  },
  13: {
    num: 13, fdi: '1.3', nameUk: 'Верхнє праве ікло', nameLa: 'Dens caninus superior dexter',
    jaw: 'upper', type: 'canine', rootsCount: 1, canalsCount: 1,
    innervation: 'Rami alveolares superiores anteriores, n. nasopalatinus',
    anesthesiaRequired: 'Інфраорбітальна (або інфільтраційна) + різцева анестезія', isNumbByDefault: false
  },
  12: {
    num: 12, fdi: '1.2', nameUk: 'Верхній правий латеральний різець', nameLa: 'Dens incisivus lateralis superior dexter',
    jaw: 'upper', type: 'incisor', rootsCount: 1, canalsCount: 1,
    innervation: 'Rami alveolares superiores anteriores, n. nasopalatinus',
    anesthesiaRequired: 'Інфільтраційна вестибулярно + різцева (foramen incisivum)', isNumbByDefault: false
  },
  11: {
    num: 11, fdi: '1.1', nameUk: 'Верхній правий центральний різець', nameLa: 'Dens incisivus centralis superior dexter',
    jaw: 'upper', type: 'incisor', rootsCount: 1, canalsCount: 1,
    innervation: 'Rami alveolares superiores anteriores, n. nasopalatinus',
    anesthesiaRequired: 'Інфільтраційна по перехідній складці + різцева (біля сосочка)', isNumbByDefault: false
  },

  // --- ВЕРХНЯ ЩЕЛЕПА ЛІВОРУЧ (КВАДРАНТ 2) ---
  21: {
    num: 21, fdi: '2.1', nameUk: 'Верхній лівий центральний різець', nameLa: 'Dens incisivus centralis superior sinister',
    jaw: 'upper', type: 'incisor', rootsCount: 1, canalsCount: 1,
    innervation: 'Rami alveolares superiores anteriores, n. nasopalatinus',
    anesthesiaRequired: 'Інфільтраційна по перехідній складці + різцева', isNumbByDefault: false
  },
  22: {
    num: 22, fdi: '2.2', nameUk: 'Верхній лівий латеральний різець', nameLa: 'Dens incisivus lateralis superior sinister',
    jaw: 'upper', type: 'incisor', rootsCount: 1, canalsCount: 1,
    innervation: 'Rami alveolares superiores anteriores, n. nasopalatinus',
    anesthesiaRequired: 'Інфільтраційна вестибулярно + різцева', isNumbByDefault: false
  },
  23: {
    num: 23, fdi: '2.3', nameUk: 'Верхнє ліве ікло', nameLa: 'Dens caninus superior sinister',
    jaw: 'upper', type: 'canine', rootsCount: 1, canalsCount: 1,
    innervation: 'Rami alveolares superiores anteriores, n. nasopalatinus',
    anesthesiaRequired: 'Інфраорбітальна (або інфільтраційна) + різцева', isNumbByDefault: false
  },
  24: {
    num: 24, fdi: '2.4', nameUk: 'Верхній лівий 1-й премоляр', nameLa: 'Dens praemolaris primus superior sinister',
    jaw: 'upper', type: 'premolar', rootsCount: 2, canalsCount: 2,
    innervation: 'Ramus alveolaris superior medius, n. palatinus major',
    anesthesiaRequired: 'Інфільтраційна вестибулярно + піднебінна', isNumbByDefault: false
  },
  25: {
    num: 25, fdi: '2.5', nameUk: 'Верхній лівий 2-й премоляр', nameLa: 'Dens praemolaris secundus superior sinister',
    jaw: 'upper', type: 'premolar', rootsCount: 1, canalsCount: 1,
    innervation: 'Ramus alveolaris superior medius, n. palatinus major',
    anesthesiaRequired: 'Інфільтраційна вестибулярно + піднебінна', isNumbByDefault: false
  },
  26: {
    num: 26, fdi: '2.6', nameUk: 'Верхній лівий 1-й моляр (Шістка)', nameLa: 'Dens molaris primus superior sinister',
    jaw: 'upper', type: 'molar', rootsCount: 3, canalsCount: 4,
    innervation: 'Rami alveolares superiores posteriores + medii + n. palatinus major',
    anesthesiaRequired: 'Туберальна + інфільтрація щоки + піднебінна анестезія', isNumbByDefault: false
  },
  27: {
    num: 27, fdi: '2.7', nameUk: 'Верхній лівий 2-й моляр', nameLa: 'Dens molaris secundus superior sinister',
    jaw: 'upper', type: 'molar', rootsCount: 3, canalsCount: 3,
    innervation: 'Rami alveolares superiores posteriores, n. palatinus major',
    anesthesiaRequired: 'Туберальна + піднебінна анестезія', isNumbByDefault: false
  },
  28: {
    num: 28, fdi: '2.8', nameUk: 'Верхній лівий 3-й моляр (Зуб мудрості)', nameLa: 'Dens molaris tertius superior sinister',
    jaw: 'upper', type: 'molar', rootsCount: 3, canalsCount: 3,
    innervation: 'Rami alveolares superiores posteriores, n. palatinus major',
    anesthesiaRequired: 'Туберальна + піднебінна анестезія', isNumbByDefault: false
  },

  // --- НИЖНЯ ЩЕЛЕПА ЛІВОРУЧ (КВАДРАНТ 3) ---
  31: {
    num: 31, fdi: '3.1', nameUk: 'Нижній лівий центральний різець', nameLa: 'Dens incisivus centralis inferior sinister',
    jaw: 'lower', type: 'incisor', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister + анастомози праворуч',
    anesthesiaRequired: 'Мандибулярна або інфільтраційна по перехідній складці', isNumbByDefault: false
  },
  32: {
    num: 32, fdi: '3.2', nameUk: 'Нижній лівий латеральний різець', nameLa: 'Dens incisivus lateralis inferior sinister',
    jaw: 'lower', type: 'incisor', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Мандибулярна або інфільтраційна', isNumbByDefault: false
  },
  33: {
    num: 33, fdi: '3.3', nameUk: 'Нижнє ліве ікло', nameLa: 'Dens caninus inferior sinister',
    jaw: 'lower', type: 'canine', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Мандибулярна або ментальна анестезія', isNumbByDefault: false
  },
  34: {
    num: 34, fdi: '3.4', nameUk: 'Нижній лівий 1-й премоляр', nameLa: 'Dens praemolaris primus inferior sinister',
    jaw: 'lower', type: 'premolar', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister (орієнтир циліндра шприца при правій мандибулярній)',
    anesthesiaRequired: 'Мандибулярна або ментальна анестезія', isNumbByDefault: false
  },
  35: {
    num: 35, fdi: '3.5', nameUk: 'Нижній лівий 2-й премоляр', nameLa: 'Dens praemolaris secundus inferior sinister',
    jaw: 'lower', type: 'premolar', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Мандибулярна або ментальна анестезія', isNumbByDefault: false
  },
  36: {
    num: 36, fdi: '3.6', nameUk: 'Нижній лівий 1-й моляр (Шістка)', nameLa: 'Dens molaris primus inferior sinister',
    jaw: 'lower', type: 'molar', rootsCount: 2, canalsCount: 3,
    innervation: 'N. alveolaris inferior, n. lingualis, n. buccalis',
    anesthesiaRequired: 'Мандибулярна (або торусальна) + n. buccalis вестибулярно', isNumbByDefault: false
  },
  37: {
    num: 37, fdi: '3.7', nameUk: 'Нижній лівий 2-й моляр', nameLa: 'Dens molaris secundus inferior sinister',
    jaw: 'lower', type: 'molar', rootsCount: 2, canalsCount: 3,
    innervation: 'N. alveolaris inferior, n. lingualis, n. buccalis',
    anesthesiaRequired: 'Мандибулярна + інфільтрація для n. buccalis', isNumbByDefault: false
  },
  38: {
    num: 38, fdi: '3.8', nameUk: 'Нижній лівий 3-й моляр (Зуб мудрості)', nameLa: 'Dens molaris tertius inferior sinister',
    jaw: 'lower', type: 'molar', rootsCount: 2, canalsCount: 3,
    innervation: 'N. alveolaris inferior, n. lingualis, n. buccalis',
    anesthesiaRequired: 'Торусальна за Вейсбремом (або мандибулярна + n. buccalis)', isNumbByDefault: false
  },

  // --- НИЖНЯ ЩЕЛЕПА ПРАВОРУЧ (КВАДРАНТ 4) ---
  48: {
    num: 48, fdi: '4.8', nameUk: 'Нижній правий 3-й моляр (Зуб мудрості)', nameLa: 'Dens molaris tertius inferior dexter',
    jaw: 'lower', type: 'molar', rootsCount: 2, canalsCount: 3,
    innervation: 'N. alveolaris inferior, n. lingualis, n. buccalis',
    anesthesiaRequired: 'Мандибулярна (або торусальна) + інфільтрація n. buccalis', isNumbByDefault: true
  },
  47: {
    num: 47, fdi: '4.7', nameUk: 'Нижній правий 2-й моляр', nameLa: 'Dens molaris secundus inferior dexter',
    jaw: 'lower', type: 'molar', rootsCount: 2, canalsCount: 3,
    innervation: 'N. alveolaris inferior, n. lingualis, n. buccalis',
    anesthesiaRequired: 'Мандибулярна + інфільтрація n. buccalis', isNumbByDefault: true
  },
  46: {
    num: 46, fdi: '4.6', nameUk: 'Нижній правий 1-й моляр (Шістка)', nameLa: 'Dens molaris primus inferior dexter',
    jaw: 'lower', type: 'molar', rootsCount: 2, canalsCount: 3,
    innervation: 'N. alveolaris inferior, n. lingualis, n. buccalis',
    anesthesiaRequired: 'Мандибулярна або торусальна + n. buccalis по перехідній складці', isNumbByDefault: true
  },
  45: {
    num: 45, fdi: '4.5', nameUk: 'Нижній правий 2-й премоляр', nameLa: 'Dens praemolaris secundus inferior dexter',
    jaw: 'lower', type: 'premolar', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior (поруч foramen mentale)',
    anesthesiaRequired: 'Мандибулярна або ментальна анестезія', isNumbByDefault: true
  },
  44: {
    num: 44, fdi: '4.4', nameUk: 'Нижній правий 1-й премоляр', nameLa: 'Dens praemolaris primus inferior dexter',
    jaw: 'lower', type: 'premolar', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior. Верхівка кореня біля foramen mentale!',
    anesthesiaRequired: 'Мандибулярна або ментальна анестезія', isNumbByDefault: true
  },
  43: {
    num: 43, fdi: '4.3', nameUk: 'Нижнє праве ікло', nameLa: 'Dens caninus inferior dexter',
    jaw: 'lower', type: 'canine', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior + анастомози протилежного боку',
    anesthesiaRequired: 'Мандибулярна + інфільтрація біля вуздечки', isNumbByDefault: true
  },
  42: {
    num: 42, fdi: '4.2', nameUk: 'Нижній правий латеральний різець', nameLa: 'Dens incisivus lateralis inferior dexter',
    jaw: 'lower', type: 'incisor', rootsCount: 1, canalsCount: 1,
    innervation: 'N. alveolaris inferior + перехресні анастомози',
    anesthesiaRequired: 'Мандибулярна або інфільтраційна', isNumbByDefault: true
  },
  41: {
    num: 41, fdi: '4.1', nameUk: 'Нижній правий центральний різець', nameLa: 'Dens incisivus centralis inferior dexter',
    jaw: 'lower', type: 'incisor', rootsCount: 1, canalsCount: 1,
    innervation: 'Плексуальна іннервація з вираженими контралатеральними анастомозами',
    anesthesiaRequired: 'Мандибулярна + додаткова інфільтрація ліворуч від вуздечки', isNumbByDefault: true
  }
};

export interface Technique3DConfig {
  id: string;
  title: string;
  shortTitle: string;
  category: 'lower' | 'upper';
  targetPos: { x: number; y: number; z: number };
  syringeOrigin: { x: number; y: number; z: number };
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  targetName: string;
  landmarks: string;
  needleAngle: string;
  depth: string;
  numbness: string;
  targetNerves: string[];
  recommendedOpening: number; // percentage (0-100)
}

export const TECHNIQUES_3D: Record<string, Technique3DConfig> = {
  mandibular: {
    id: 'mandibular',
    title: 'Мандибулярна анестезія (ОНМедУ)',
    shortTitle: 'Мандибулярна',
    category: 'lower',
    targetPos: { x: -3.3, y: 1.5, z: -4.1 },
    syringeOrigin: { x: 1.7, y: -0.9, z: 0.9 }, // Opposite premolars 34-35
    cameraPos: [0, 8, -18],
    cameraTarget: [-2.5, 1.2, -3.5],
    targetName: 'Sulcus colli mandibulae (над Lingula mandibulae)',
    landmarks: 'Латеральний скат plica pterygomandibularis, на 10 мм вище жувальної поверхні нижніх молярів',
    needleAngle: 'Шприц спирається на премоляри протилежного боку (34-35), кут 40–45°',
    depth: '15–20 мм (обов’язковий упор у кістку!)',
    numbness: 'Зуби 4.8–4.1, тіло щелепи, слизова губи та підборіддя, 2/3 язика',
    targetNerves: ['N. alveolaris inferior', 'N. lingualis'],
    recommendedOpening: 85 // Wide mouth opening
  },
  torusal: {
    id: 'torusal',
    title: 'Торусальна анестезія за Вейсбремом',
    shortTitle: 'Торусальна',
    category: 'lower',
    targetPos: { x: -3.0, y: 2.3, z: -3.6 },
    syringeOrigin: { x: 2.2, y: 0.2, z: 0.5 }, // Opposite mouth corner
    cameraPos: [-0.5, 9, -16],
    cameraTarget: [-2.2, 2.0, -3.0],
    targetName: 'Нижньощелепний валик (Torus mandibulae)',
    landmarks: 'Борозна між plica pterygomandibularis та щокою, на 0.5 см нижче верхнього 3-го моляра',
    needleAngle: 'Шприц із протилежного кута рота, перпендикулярно до внутрішньої поверхні гілки',
    depth: '5–10 мм (до контакту з кістковим валиком)',
    numbness: 'Одночасна блокада трьох нервів: n. alveolaris inferior, n. lingualis, n. buccalis!',
    targetNerves: ['N. alveolaris inferior', 'N. lingualis', 'N. buccalis'],
    recommendedOpening: 90
  },
  tuberal: {
    id: 'tuberal',
    title: 'Туберальна анестезія',
    shortTitle: 'Туберальна',
    category: 'upper',
    targetPos: { x: -2.7, y: 3.2, z: -2.3 },
    syringeOrigin: { x: -3.6, y: -0.5, z: 2.0 }, // Vestibular fold above 2nd molar
    cameraPos: [-16, 8, -12],
    cameraTarget: [-2.7, 3.0, -2.0],
    targetName: 'Горб верхньої щелепи (Tuber maxillae)',
    landmarks: 'Перехідна складка над 2-м верхнім моляром позаду вилицеальвеолярного гребеня',
    needleAngle: 'Догори, назад і всередину під кутом 45° по кістці горба щелепи',
    depth: '20–25 мм (НЕ глибше! Ризик пошкодження plexus venosus pterygoideus)',
    numbness: 'Моляри верхньої щелепи (1.8, 1.7, частково 1.6), окістя та щокова слизова',
    targetNerves: ['Rami alveolares superiores posteriores'],
    recommendedOpening: 40 // Half-open mouth so cheek relaxes
  },
  infraorbital: {
    id: 'infraorbital',
    title: 'Інфраорбітальна анестезія',
    shortTitle: 'Інфраорбітальна',
    category: 'upper',
    targetPos: { x: -2.2, y: 4.8, z: 1.6 },
    syringeOrigin: { x: -1.5, y: -0.5, z: 5.5 }, // Anterior canine fossa
    cameraPos: [-6, 10, 20],
    cameraTarget: [-2.0, 4.0, 1.5],
    targetName: 'Під’очноямковий отвір (Foramen infraorbitale)',
    landmarks: 'На 5–7 мм нижче нижньоочного краю на зіницевій лінії (над верхівками 1.4–1.5)',
    needleAngle: 'Знизу догори, ззаду та назовні в canalis infraorbitalis',
    depth: '8–12 мм (фіксація пальцем нижнього очного краю для захисту орбіти)',
    numbness: 'Зуби 1.1–1.5, кістка, крило носа, верхня губа, нижня повіка',
    targetNerves: ['Rami alveolares superiores anteriores & medii', 'N. infraorbitalis'],
    recommendedOpening: 20
  },
  palatal: {
    id: 'palatal',
    title: 'Піднебінна (Палатинальна) анестезія',
    shortTitle: 'Піднебінна',
    category: 'upper',
    targetPos: { x: -1.5, y: 1.6, z: -1.5 },
    syringeOrigin: { x: 1.8, y: -0.5, z: -0.5 },
    cameraPos: [0, -14, -8],
    cameraTarget: [-1.2, 1.8, -1.0],
    targetName: 'Великий піднебінний отвір (Foramen palatinum majus)',
    landmarks: 'На 1 см спереду від заднього краю твердого піднебіння на рівні 3-го моляра',
    needleAngle: 'Знизу вгору та трохи ззаду наперед у піднебінне склепіння',
    depth: '3–5 мм (вводити повільно не більше 0.3–0.5 мл під тиском)',
    numbness: 'Слизова та окістя твердого піднебіння від 1.8 до 1.3 зуба',
    targetNerves: ['N. palatinus major'],
    recommendedOpening: 70
  },
  incisive: {
    id: 'incisive',
    title: 'Різцева (Назопалатинальна) анестезія',
    shortTitle: 'Різцева',
    category: 'upper',
    targetPos: { x: -0.2, y: 1.5, z: 2.1 },
    syringeOrigin: { x: 0.0, y: -2.0, z: 5.0 },
    cameraPos: [0, -10, 10],
    cameraTarget: [0, 1.5, 2.0],
    targetName: 'Різцевий отвір (Foramen incisivum)',
    landmarks: 'Позаду центральних різців 1.1 та 2.1 біля основи різцевого сосочка (Papilla incisiva)',
    needleAngle: 'Знизу вгору та назад паралельно осям центральних різців',
    depth: '3–5 мм (об’єм 0.2–0.3 мл)',
    numbness: 'Слизова твердого піднебіння в трикутнику від 1.3 до 2.3 (ікло-ікло)',
    targetNerves: ['N. nasopalatinus'],
    recommendedOpening: 65
  },
  mental: {
    id: 'mental',
    title: 'Ментальна анестезія',
    shortTitle: 'Ментальна',
    category: 'lower',
    targetPos: { x: -2.0, y: -1.8, z: 0.9 },
    syringeOrigin: { x: -3.5, y: 1.5, z: -1.5 },
    cameraPos: [-12, 0, 14],
    cameraTarget: [-2.0, -1.5, 0.9],
    targetName: 'Підборідний отвір (Foramen mentale)',
    landmarks: 'Перехідна складка між коренями премолярів 4.4 та 4.5 на середині висоти щелепи',
    needleAngle: 'Згори донизу, ззаду наперед та ззовні всередину в устя каналу',
    depth: '5–8 мм',
    numbness: 'Нижня губа, шкіра підборіддя, вестибулярні ясна від 4.5 до 4.1',
    targetNerves: ['N. mentalis', 'Rami incisivi'],
    recommendedOpening: 25
  }
};

const TMJ_PIVOT_Y = 4.15;
const TMJ_PIVOT_Z = -5.13;

interface Mandible3DViewerProps {
  highlightTechnique?: string;
  selectedTooth?: number | null;
  onSelectTooth?: (toothNumber: number) => void;
  onSelectTechnique?: (tech: any) => void;
}

export const Mandible3DViewer: React.FC<Mandible3DViewerProps> = ({
  highlightTechnique = 'mandibular',
  selectedTooth = null,
  onSelectTooth,
  onSelectTechnique
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Technique State
  const [activeTechniqueId, setActiveTechniqueId] = useState<string>(highlightTechnique || 'mandibular');

  // Mouth Opening State (0 to 100%, where 0 = closed 0 mm, 100 = 45 mm opening)
  const [mouthOpening, setMouthOpening] = useState<number>(75);
  const mouthOpeningRef = useRef<number>(75);
  const currentMouthAngleRef = useRef<number>(0);

  useEffect(() => {
    mouthOpeningRef.current = mouthOpening;
  }, [mouthOpening]);

  // Loading state
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fullscreen & UI Panels
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLayersDrawer, setShowLayersDrawer] = useState<boolean>(false);

  // Anatomical Visibility Layers
  const [isXRay, setIsXRay] = useState<boolean>(true);
  const [showMaxilla, setShowMaxilla] = useState<boolean>(true);
  const [showMandible, setShowMandible] = useState<boolean>(true);
  const [showGingiva, setShowGingiva] = useState<boolean>(false);
  const [showNerves, setShowNerves] = useState<boolean>(true);
  const [showPlexus, setShowPlexus] = useState<boolean>(true);
  const [showNeedle, setShowNeedle] = useState<boolean>(true);

  // Active Tooth Selection
  const [inspectedTooth, setInspectedTooth] = useState<number>(46);
  const [activeQuadrant, setActiveQuadrant] = useState<'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q4');

  // Dynamic 3D Refs
  const boneMeshesRef = useRef<THREE.Mesh[]>([]);
  const maxillaGroupRef = useRef<THREE.Group | null>(null);
  const mandiblePivotRef = useRef<THREE.Group | null>(null);
  const mandibleGroupRef = useRef<THREE.Group | null>(null);
  const gingivaGroupRef = useRef<THREE.Group | null>(null);
  const neuroGroupRef = useRef<THREE.Group | null>(null);
  const plexusMeshesRef = useRef<THREE.Mesh[]>([]);
  const teethMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const needleGroupRef = useRef<THREE.Group | null>(null);
  const depotMeshRef = useRef<THREE.Mesh | null>(null);
  const targetRingMeshRef = useRef<THREE.Mesh | null>(null);

  // Active technique config
  const currentTechniqueConfig = useMemo(() => {
    return TECHNIQUES_3D[activeTechniqueId] || TECHNIQUES_3D.mandibular;
  }, [activeTechniqueId]);

  // Current inspected tooth details
  const currentToothData = useMemo(() => {
    return ALL_32_TEETH[inspectedTooth] || ALL_32_TEETH[46];
  }, [inspectedTooth]);

  // Sync prop changes
  useEffect(() => {
    if (highlightTechnique && TECHNIQUES_3D[highlightTechnique]) {
      setActiveTechniqueId(highlightTechnique);
      // Auto-set optimal mouth opening for this technique
      setMouthOpening(TECHNIQUES_3D[highlightTechnique].recommendedOpening);
    }
  }, [highlightTechnique]);

  useEffect(() => {
    if (selectedTooth && ALL_32_TEETH[selectedTooth]) {
      setInspectedTooth(selectedTooth);
      const quad = Math.floor(selectedTooth / 10);
      setActiveQuadrant(`Q${quad}` as any);
    }
  }, [selectedTooth]);

  // Main Three.js Scene Setup & Model Loading
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060e20);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 8, -18);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    controls.minDistance = 5;
    controls.target.set(-2.5, 1.2, -3.5);

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const dirLightFront = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLightFront.position.set(20, 25, 30);
    scene.add(dirLightFront);

    const dirLightBack = new THREE.DirectionalLight(0x06b6d4, 1.4);
    dirLightBack.position.set(-20, 20, -30);
    scene.add(dirLightBack);

    const pointRimLight = new THREE.PointLight(0x22d3ee, 3.0, 80);
    pointRimLight.position.set(0, -8, 5);
    scene.add(pointRimLight);

    // 5. ANATOMICAL GROUPS WITH TMJ PIVOT
    const maxillaGroup = new THREE.Group();
    
    // TMJ Hinge Pivot at the Condyles Axis
    const mandiblePivot = new THREE.Group();
    mandiblePivot.position.set(0, TMJ_PIVOT_Y, TMJ_PIVOT_Z);

    const mandibleGroup = new THREE.Group();
    mandibleGroup.position.set(0, -TMJ_PIVOT_Y, -TMJ_PIVOT_Z);
    mandiblePivot.add(mandibleGroup);

    const gingivaGroup = new THREE.Group();
    const neuroGroup = new THREE.Group();

    maxillaGroupRef.current = maxillaGroup;
    mandiblePivotRef.current = mandiblePivot;
    mandibleGroupRef.current = mandibleGroup;
    gingivaGroupRef.current = gingivaGroup;
    neuroGroupRef.current = neuroGroup;

    scene.add(maxillaGroup);
    scene.add(mandiblePivot);
    scene.add(gingivaGroup);
    scene.add(neuroGroup);

    boneMeshesRef.current = [];
    plexusMeshesRef.current = [];
    teethMeshesRef.current.clear();

    // 6. SETUP GLTF LOADER WITH MESHOPT
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const basePath = import.meta.env.BASE_URL || './';
    const coreUrl = `${basePath}models/core.glb`.replace('//', '/');
    const neuroUrl = `${basePath}models/neurovascular.glb`.replace('//', '/');

    // Bone Materials
    const boneMatSolid = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.42,
      metalness: 0.08
    });

    const boneMatXRay = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.32,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.65,
      ior: 1.3,
      depthWrite: false
    });

    const gingivaMat = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      roughness: 0.35,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });

    const nerveMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.95,
      roughness: 0.2
    });

    const plexusMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.7,
      roughness: 0.3
    });

    // LOAD CORE.GLB (Full Mandible, Maxilla, 32 Teeth, Gums)
    loader.load(
      coreUrl,
      (gltf) => {
        setLoadingProgress(60);
        const root = gltf.scene;

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const name = mesh.name.toLowerCase();

            if (name.startsWith('tooth-')) {
              const toothNum = parseInt(name.replace('tooth-', ''), 10);
              mesh.userData = { toothNumber: toothNum };

              const isNumb = toothNum >= 41 && toothNum <= 48;
              const isSelected = toothNum === inspectedTooth;

              mesh.material = new THREE.MeshStandardMaterial({
                color: isSelected ? 0x22d3ee : isNumb ? 0x67e8f9 : 0xf8fafc,
                emissive: isSelected ? 0x0891b2 : isNumb ? 0x0e7490 : 0x000000,
                emissiveIntensity: isSelected ? 0.85 : isNumb ? 0.35 : 0,
                roughness: 0.25,
                metalness: 0.05
              });

              teethMeshesRef.current.set(toothNum, mesh);

              if (toothNum < 30) {
                maxillaGroup.add(mesh.clone());
              } else {
                // Lower teeth move with the mandible!
                mandibleGroup.add(mesh.clone());
              }
            } else if (name.includes('gingiva')) {
              mesh.material = gingivaMat;
              if (name.includes('lower')) {
                mandibleGroup.add(mesh.clone());
              } else {
                gingivaGroup.add(mesh.clone());
              }
            } else if (name.includes('maxilla') || name.includes('sinus')) {
              mesh.material = isXRay ? boneMatXRay : boneMatSolid;
              boneMeshesRef.current.push(mesh);
              maxillaGroup.add(mesh.clone());
            } else if (name.includes('mandib')) {
              mesh.material = isXRay ? boneMatXRay : boneMatSolid;
              boneMeshesRef.current.push(mesh);
              // Mandible body, condyles, alveolar process rotate with mandibleGroup!
              mandibleGroup.add(mesh.clone());
            }
          }
        });

        // LOAD NEUROVASCULAR.GLB
        loader.load(
          neuroUrl,
          (neuroGltf) => {
            setLoadingProgress(100);
            setIsLoading(false);

            neuroGltf.scene.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const name = mesh.name.toLowerCase();

                if (name.includes('plexus')) {
                  mesh.material = plexusMat;
                  plexusMeshesRef.current.push(mesh);
                  neuroGroup.add(mesh.clone());
                } else if (name.includes('nerve')) {
                  mesh.material = nerveMat;
                  if (name.includes('inferior-alveolar') || name.includes('mental-nerve') || name.includes('incisive-nerve')) {
                    // Lower nerves move with the mandible canal!
                    mandibleGroup.add(mesh.clone());
                  } else {
                    neuroGroup.add(mesh.clone());
                  }
                } else if (name.includes('artery') || name.includes('vein')) {
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: name.includes('artery') ? 0xef4444 : 0x0284c7,
                    roughness: 0.3
                  });
                  if (name.includes('inferior-alveolar')) {
                    mandibleGroup.add(mesh.clone());
                  } else {
                    neuroGroup.add(mesh.clone());
                  }
                }
              }
            });
          },
          (xhr) => {
            if (xhr.total > 0) {
              setLoadingProgress(60 + Math.round((xhr.loaded / xhr.total) * 40));
            }
          },
          (err) => {
            console.warn('Could not load neurovascular.glb:', err);
            setIsLoading(false);
          }
        );
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 60));
        }
      },
      (err) => {
        console.error('Error loading core.glb:', err);
        setLoadError('Не вдалося завантажити 3D модель. Будь ласка, оновіть сторінку.');
        setIsLoading(false);
      }
    );

    // 7. 3D CARPULED SURGICAL SYRINGE & NEEDLE
    const needleGroup = new THREE.Group();
    needleGroupRef.current = needleGroup;

    // Syringe Barrel
    const barrelGeom = new THREE.CylinderGeometry(0.55, 0.55, 12, 16);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const barrelMesh = new THREE.Mesh(barrelGeom, barrelMat);

    // Finger Plunger Ring
    const ringGeom = new THREE.TorusGeometry(0.8, 0.18, 12, 24);
    const ringMesh = new THREE.Mesh(ringGeom, barrelMat);
    ringMesh.position.y = -6.8;
    needleGroup.add(ringMesh);

    // 27G Needle
    const needleGeom = new THREE.CylinderGeometry(0.05, 0.05, 7.5, 8);
    const needleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 });
    const needleMesh = new THREE.Mesh(needleGeom, needleMat);
    needleMesh.position.y = 9.5;

    // Deposition Liquid Depot Bloom at Target Landmark
    const depotGeom = new THREE.SphereGeometry(1.6, 16, 16);
    const depotMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      transmission: 0.8
    });
    const depotMesh = new THREE.Mesh(depotGeom, depotMat);
    depotMeshRef.current = depotMesh;

    // Glowing Target Ring Bullseye at Entry
    const targetRingGeom = new THREE.TorusGeometry(0.8, 0.12, 12, 24);
    const targetRingMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const targetRing = new THREE.Mesh(targetRingGeom, targetRingMat);
    targetRingMeshRef.current = targetRing;

    needleGroup.add(barrelMesh);
    needleGroup.add(needleMesh);

    // Attach needle to either mandible or maxilla depending on active technique
    const initCfg = TECHNIQUES_3D[activeTechniqueId] || TECHNIQUES_3D.mandibular;
    if (initCfg.category === 'lower') {
      mandibleGroup.add(needleGroup);
      mandibleGroup.add(depotMesh);
      mandibleGroup.add(targetRing);
    } else {
      scene.add(needleGroup);
      scene.add(depotMesh);
      scene.add(targetRing);
    }

    needleGroup.position.set(initCfg.syringeOrigin.x, initCfg.syringeOrigin.y, initCfg.syringeOrigin.z);
    needleGroup.lookAt(initCfg.targetPos.x, initCfg.targetPos.y, initCfg.targetPos.z);
    needleGroup.rotateX(Math.PI / 2);
    depotMesh.position.set(initCfg.targetPos.x, initCfg.targetPos.y, initCfg.targetPos.z);
    targetRing.position.set(initCfg.targetPos.x, initCfg.targetPos.y, initCfg.targetPos.z);

    // 8. RAYCASTER FOR DIRECT 3D TEETH CLICKING
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerClick = (e: MouseEvent | TouchEvent) => {
      if (!rendererRef.current || !cameraRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== scene) {
          if (curr.userData && curr.userData.toothNumber) {
            const toothNum = curr.userData.toothNumber;
            setInspectedTooth(toothNum);
            const quad = Math.floor(toothNum / 10);
            setActiveQuadrant(`Q${quad}` as any);
            if (onSelectTooth) onSelectTooth(toothNum);
            return;
          }
          curr = curr.parent;
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handlePointerClick);

    // 9. ANIMATION LOOP WITH TMJ ROTATION LERP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();

      // Smooth Mandible Opening Animation in TMJ
      if (mandiblePivotRef.current) {
        // mouthOpening is 0 to 100
        const targetAngle = (mouthOpeningRef.current / 100) * 0.52; // max ~30 degrees rotation
        currentMouthAngleRef.current = THREE.MathUtils.lerp(currentMouthAngleRef.current, targetAngle, 0.08);

        mandiblePivotRef.current.rotation.x = currentMouthAngleRef.current;
        // Natural condylar downward-forward glide in articular eminence
        mandiblePivotRef.current.position.y = TMJ_PIVOT_Y - Math.sin(currentMouthAngleRef.current) * 0.25;
        mandiblePivotRef.current.position.z = TMJ_PIVOT_Z + Math.sin(currentMouthAngleRef.current) * 0.35;
      }

      if (depotMeshRef.current) {
        const scale = 1 + Math.sin(time * 3) * 0.12;
        depotMeshRef.current.scale.set(scale, scale, scale);
      }
      if (targetRingMeshRef.current) {
        targetRingMeshRef.current.rotation.z += 0.02;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. RESIZE HANDLER
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 420;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      domElement.removeEventListener('click', handlePointerClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Update Injection Needle & Target on Technique Change
  useEffect(() => {
    const cfg = TECHNIQUES_3D[activeTechniqueId] || TECHNIQUES_3D.mandibular;
    
    // Attach needle to either mandible or scene
    if (needleGroupRef.current && depotMeshRef.current && targetRingMeshRef.current) {
      if (cfg.category === 'lower' && mandibleGroupRef.current) {
        mandibleGroupRef.current.add(needleGroupRef.current);
        mandibleGroupRef.current.add(depotMeshRef.current);
        mandibleGroupRef.current.add(targetRingMeshRef.current);
      } else if (sceneRef.current) {
        sceneRef.current.add(needleGroupRef.current);
        sceneRef.current.add(depotMeshRef.current);
        sceneRef.current.add(targetRingMeshRef.current);
      }

      needleGroupRef.current.position.set(cfg.syringeOrigin.x, cfg.syringeOrigin.y, cfg.syringeOrigin.z);
      needleGroupRef.current.lookAt(cfg.targetPos.x, cfg.targetPos.y, cfg.targetPos.z);
      needleGroupRef.current.rotateX(Math.PI / 2);

      depotMeshRef.current.position.set(cfg.targetPos.x, cfg.targetPos.y, cfg.targetPos.z);
      targetRingMeshRef.current.position.set(cfg.targetPos.x, cfg.targetPos.y, cfg.targetPos.z);
      targetRingMeshRef.current.lookAt(cfg.syringeOrigin.x, cfg.syringeOrigin.y, cfg.syringeOrigin.z);
    }

    // Smoothly focus camera on the specific injection site
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...cfg.cameraPos);
      controlsRef.current.target.set(...cfg.cameraTarget);
      controlsRef.current.update();
    }
  }, [activeTechniqueId]);

  // Update Materials when X-Ray is toggled
  useEffect(() => {
    boneMeshesRef.current.forEach(mesh => {
      if (isXRay) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.32,
          roughness: 0.2,
          metalness: 0.1,
          transmission: 0.65,
          ior: 1.3,
          depthWrite: false
        });
      } else {
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          roughness: 0.42,
          metalness: 0.08
        });
      }
    });
  }, [isXRay]);

  // Update Layers Visibility
  useEffect(() => {
    if (maxillaGroupRef.current) maxillaGroupRef.current.visible = showMaxilla;
    if (mandiblePivotRef.current) mandiblePivotRef.current.visible = showMandible;
    if (gingivaGroupRef.current) gingivaGroupRef.current.visible = showGingiva;
    if (neuroGroupRef.current) neuroGroupRef.current.visible = showNerves;
    if (needleGroupRef.current) needleGroupRef.current.visible = showNeedle;
    if (depotMeshRef.current) depotMeshRef.current.visible = showNeedle;
    if (targetRingMeshRef.current) targetRingMeshRef.current.visible = showNeedle;
    plexusMeshesRef.current.forEach(m => m.visible = showPlexus);
  }, [showMaxilla, showMandible, showGingiva, showNerves, showPlexus, showNeedle]);

  // Update Highlighted Tooth
  useEffect(() => {
    teethMeshesRef.current.forEach((mesh, toothNum) => {
      const isSelected = toothNum === inspectedTooth;
      const isNumb = toothNum >= 41 && toothNum <= 48;
      const mat = mesh.material as THREE.MeshStandardMaterial;

      if (mat) {
        mat.color.setHex(isSelected ? 0x22d3ee : isNumb ? 0x67e8f9 : 0xf8fafc);
        mat.emissive.setHex(isSelected ? 0x0891b2 : isNumb ? 0x0e7490 : 0x000000);
        mat.emissiveIntensity = isSelected ? 0.9 : isNumb ? 0.35 : 0;
      }
    });
  }, [inspectedTooth]);

  // Handle Fullscreen Resize
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || (isFullscreen ? window.innerHeight : 420);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Convenient Mobile Navigation Controls
  const handleZoom = (factor: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.multiplyScalar(factor);
    controlsRef.current.update();
  };

  const handleRotate90 = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const pos = cameraRef.current.position;
    const x = pos.x;
    const z = pos.z;
    pos.x = -z;
    pos.z = x;
    controlsRef.current.update();
  };

  const handleResetCamera = () => {
    const cfg = currentTechniqueConfig;
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...cfg.cameraPos);
      controlsRef.current.target.set(...cfg.cameraTarget);
      controlsRef.current.update();
    }
  };

  // Filtered teeth for the selector ribbon
  const displayedTeeth = useMemo(() => {
    return Object.values(ALL_32_TEETH).filter(t => {
      if (activeQuadrant === 'all') return true;
      const quad = Math.floor(t.num / 10);
      return activeQuadrant === `Q${quad}`;
    });
  }, [activeQuadrant]);

  // Opening distance in mm
  const mouthOpeningMm = Math.round((mouthOpening / 100) * 45);

  return (
    <div className={`relative bg-[#060E20] border border-cyan-800/40 rounded-2xl overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none flex flex-col' : ''
    }`}>
      {/* 3D Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0B1326]/95 border-b border-slate-800 text-xs font-mono shrink-0">
        <div className="flex items-center gap-2 text-cyan-400">
          <Rotate3d className="w-4 h-4 animate-spin-slow" />
          <span className="font-bold">ПОВНА 3D ЩЕЛЕПА ТА ВКОЛ</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* X-Ray Switch */}
          <button
            onClick={() => setIsXRay(!isXRay)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              isXRay
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            X-Ray: {isXRay ? 'ON' : 'OFF'}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded-lg border transition-all ${
              isFullscreen
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isFullscreen ? 'Вийти з повного екрана' : 'На весь екран на телефоні'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Technique Selector Ribbon */}
      <div className="px-2 py-1.5 bg-[#091329] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold pl-1 flex items-center gap-1 shrink-0">
          <Syringe className="w-3.5 h-3.5" /> Вкол:
        </span>
        {Object.values(TECHNIQUES_3D).map(tech => {
          const isSelected = tech.id === activeTechniqueId;
          return (
            <button
              key={tech.id}
              onClick={() => {
                setActiveTechniqueId(tech.id);
                setMouthOpening(tech.recommendedOpening);
                if (onSelectTechnique) onSelectTechnique(tech);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap font-bold transition-all border shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/20'
                  : 'bg-[#0E1A38] text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {tech.shortTitle}
            </button>
          );
        })}
      </div>

      {/* Interactive Mouth Opening Slider & Controls (FEATURE: ВІДКРИВАННЯ РОТА) */}
      <div className="px-3 py-1.5 bg-[#0B152E] border-b border-slate-800 flex items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-1.5 font-bold text-slate-200 shrink-0">
          <span className="text-sm">👄</span>
          <span>Відкривання рота:</span>
          <span className="font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800 text-[11px]">
            {mouthOpeningMm} мм
          </span>
        </div>

        {/* Range Slider for smooth TMJ opening */}
        <input
          type="range"
          min="0"
          max="100"
          value={mouthOpening}
          onChange={(e) => setMouthOpening(Number(e.target.value))}
          className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg max-w-[140px]"
          title="Регулюйте ступінь відкривання рота"
        />

        {/* Quick Opening Presets */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setMouthOpening(0)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
              mouthOpening === 0
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Зімкнуті щелепи (Оклюзія)"
          >
            0 мм
          </button>
          <button
            onClick={() => setMouthOpening(50)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
              mouthOpening > 25 && mouthOpening < 70
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Напіввідкритий рот (22 мм)"
          >
            22 мм
          </button>
          <button
            onClick={() => setMouthOpening(85)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all ${
              mouthOpening >= 70
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 border-cyan-300 font-extrabold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Широко відкритий рот для мандибулярного вколу (ОНМедУ)"
          >
            40 мм
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className={`relative w-full cursor-grab active:cursor-grabbing select-none touch-none bg-[#070D1B] ${
          isFullscreen ? 'flex-1 h-full' : 'h-[380px]'
        }`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#060E20]/90 backdrop-blur-md">
            <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold text-slate-200">
              Завантаження 3D-моделі щелепи...
            </p>
            <div className="w-48 bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 mt-1">{loadingProgress}%</span>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-[#060E20]/90 text-center">
            <AlertTriangle className="w-8 h-8 text-rose-400 mb-2" />
            <p className="text-xs text-rose-300 font-semibold">{loadError}</p>
          </div>
        )}

        {/* Floating Technique Target Badge */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none max-w-[70%]">
          <div className="bg-[#0B1326]/90 backdrop-blur-md p-2 rounded-xl border border-cyan-500/40 shadow-lg space-y-0.5">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{currentTechniqueConfig.title}</span>
            </div>
            <p className="text-[10px] text-slate-300 font-mono leading-tight">
              Ціль: {currentTechniqueConfig.targetName}
            </p>
          </div>
        </div>

        {/* Convenient Mobile Navigation Controls (Bottom Right Floating) */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10 pointer-events-auto">
          <button
            onClick={() => handleZoom(0.85)}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            title="Наблизити (+)"
          >
            <ZoomIn className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={() => handleZoom(1.15)}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            title="Віддалити (-)"
          >
            <ZoomOut className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={handleRotate90}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            title="Повернути на 90°"
          >
            <Compass className="w-4 h-4 text-teal-400" />
          </button>
          <button
            onClick={handleResetCamera}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            title="Скинути ракурс"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Toggleable Anatomical Layers Button (Top Right Floating) */}
        <div className="absolute top-3 right-3 z-10 pointer-events-auto flex flex-col items-end gap-1">
          <button
            onClick={() => setShowLayersDrawer(!showLayersDrawer)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 transition-all ${
              showLayersDrawer
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow'
                : 'bg-[#0B1326]/90 text-slate-300 border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Шари</span>
          </button>

          {/* Collapsible Layers Dropdown */}
          {showLayersDrawer && (
            <div className="bg-[#0B1326]/95 backdrop-blur-xl p-2.5 rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-1 w-52 mt-1">
              <span className="text-[9px] font-mono uppercase text-slate-400 px-1 font-bold">
                Анатомічні шари 3D:
              </span>
              <button
                onClick={() => setShowMaxilla(!showMaxilla)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono border bg-slate-900/80 text-slate-200 border-slate-700 flex items-center justify-between"
              >
                <span>Верхня щелепа</span>
                {showMaxilla ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
              </button>
              <button
                onClick={() => setShowMandible(!showMandible)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono border bg-slate-900/80 text-slate-200 border-slate-700 flex items-center justify-between"
              >
                <span>Нижня щелепа</span>
                {showMandible ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
              </button>
              <button
                onClick={() => setShowNerves(!showNerves)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono border bg-slate-900/80 text-amber-300 border-slate-700 flex items-center justify-between"
              >
                <span>Нерви (V3 & V2)</span>
                {showNerves ? <Eye className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
              </button>
              <button
                onClick={() => setShowPlexus(!showPlexus)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono border bg-slate-900/80 text-blue-300 border-slate-700 flex items-center justify-between"
              >
                <span>Венозне сплетення</span>
                {showPlexus ? <Eye className="w-3 h-3 text-blue-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
              </button>
              <button
                onClick={() => setShowGingiva(!showGingiva)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono border bg-slate-900/80 text-rose-300 border-slate-700 flex items-center justify-between"
              >
                <span>Ясна (Gingiva)</span>
                {showGingiva ? <Eye className="w-3 h-3 text-rose-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
              </button>
              <button
                onClick={() => setShowNeedle(!showNeedle)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono border bg-slate-900/80 text-cyan-300 border-slate-700 flex items-center justify-between"
              >
                <span>Шприц & Голка</span>
                {showNeedle ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-2 left-3 flex items-center text-[10px] font-mono text-slate-400 pointer-events-none">
          <span className="bg-slate-900/85 backdrop-blur px-2 py-0.5 rounded border border-slate-800">
            Обертайте 1 пальцем • Клік по зубу для інфо
          </span>
        </div>
      </div>

      {/* Selected Technique Details Bar */}
      <div className="p-3 bg-[#0B1326] border-t border-slate-800 space-y-2 text-xs shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-[#070D1B] border border-slate-800/80">
            <span className="text-cyan-400 font-bold block mb-0.5">Анатомічні орієнтири вколу:</span>
            <span className="text-slate-300 leading-relaxed">
              {currentTechniqueConfig.landmarks}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[#070D1B] border border-slate-800/80">
            <span className="text-teal-400 font-bold block mb-0.5">Положення циліндра та кут:</span>
            <span className="text-slate-300 leading-relaxed">
              {currentTechniqueConfig.needleAngle}
            </span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] flex items-center justify-between">
          <span className="text-slate-300">
            Глибина: <strong className="text-cyan-300 font-mono">{currentTechniqueConfig.depth}</strong>
          </span>
          <span className="text-slate-400 text-right">
            Зона: <strong className="text-slate-200">{currentTechniqueConfig.numbness}</strong>
          </span>
        </div>
      </div>

      {/* 32 Teeth Quadrant Navigation Tabs */}
      <div className="p-2 bg-[#081124] border-t border-slate-800 flex items-center justify-between gap-1 text-xs shrink-0">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
          Зуби (FDI):
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveQuadrant('Q1')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all border ${
              activeQuadrant === 'Q1'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            1 (Верх Пр)
          </button>
          <button
            onClick={() => setActiveQuadrant('Q2')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all border ${
              activeQuadrant === 'Q2'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            2 (Верх Лів)
          </button>
          <button
            onClick={() => setActiveQuadrant('Q3')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all border ${
              activeQuadrant === 'Q3'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            3 (Низ Лів)
          </button>
          <button
            onClick={() => setActiveQuadrant('Q4')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all border ${
              activeQuadrant === 'Q4'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            4 (Низ Пр)
          </button>
        </div>
      </div>

      {/* Horizontal Tooth Selector Ribbon */}
      <div className="px-3 py-1.5 bg-[#070D1B] border-t border-slate-800/80 overflow-x-auto scrollbar-none shrink-0">
        <div className="flex items-center gap-1.5 min-w-max">
          {displayedTeeth.map(t => {
            const isSelected = t.num === inspectedTooth;
            return (
              <button
                key={t.num}
                onClick={() => setInspectedTooth(t.num)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/20'
                    : t.isNumbByDefault
                    ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60 hover:border-cyan-700'
                    : 'bg-[#101B33] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {t.fdi}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tooth Clinical Diagnostic Card */}
      <div className="p-3 bg-[#0B1326] border-t border-slate-800 space-y-2 text-xs shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono font-bold text-xs">
                FDI {currentToothData.fdi}
              </span>
              <h4 className="font-bold text-slate-100 text-sm">
                {currentToothData.nameUk}
              </h4>
            </div>
            <p className="text-[11px] font-serif italic text-slate-400 mt-0.5">
              {currentToothData.nameLa}
            </p>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
            currentToothData.isNumbByDefault
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {currentToothData.isNumbByDefault ? '✓ ОНІМІВ (Знеболений)' : 'Чутливий'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-[#070D1B] border border-slate-800/80">
            <span className="text-cyan-400 font-bold block mb-0.5">Корені та канали:</span>
            <span className="text-slate-300">
              Коренів: <strong>{currentToothData.rootsCount}</strong> • Каналів: <strong>{currentToothData.canalsCount}</strong> (рентген)
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[#070D1B] border border-slate-800/80">
            <span className="text-amber-400 font-bold block mb-0.5">Іннервація:</span>
            <span className="text-slate-300 leading-snug">
              {currentToothData.innervation}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Протокол знеболення для видалення/лікування {currentToothData.fdi}:
          </div>
          <p className="text-slate-200">
            {currentToothData.anesthesiaRequired}
          </p>
        </div>
      </div>
    </div>
  );
};
