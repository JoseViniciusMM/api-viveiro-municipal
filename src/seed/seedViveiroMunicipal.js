import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import faker from "faker-br";
import { fileURLToPath } from "url";

import DbConnect from "../config/DbConnect.js";

import Usuario from "../models/Usuario.js";
import Especie from "../models/Especie.js";
import Estufa from "../models/Estufa.js";
import Lote from "../models/Lote.js";
import Movimentacao from "../models/Movimentacao.js";
import Destinatario from "../models/Destinatario.js";
import LogAuditoria from "../models/LogAuditoria.js";

import { AUDITORIA_ACOES, AUDITORIA_ENTIDADES } from "../constants/auditoria.js";
import { TIPO_USUARIO_ENUM, STATUS_USUARIO_ENUM } from "../constants/usuario.js";
import { CATEGORIA_ESPECIE_ENUM, TIPO_ESPECIE_ENUM, STATUS_ESPECIE_ENUM } from "../constants/especie.js";
import { TIPO_PESSOA_ENUM, CATEGORIA_USUARIO_ENUM, STATUS_DESTINATARIO } from "../constants/destinatario.js";
import { FASE_LOTE, STATUS } from "../constants/lote.js";
import { TIPO_MOVIMENTACAO } from "../constants/movimentacao.js";
import { STATUS_ESTUFA } from "../constants/estufa.js";

const SENHA_PURA = "Admin@123!";
const senhaHash = bcrypt.hashSync(SENHA_PURA, 12);

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getValues(enumObj) {
  if (!enumObj) return [];
  return Array.isArray(enumObj) ? enumObj : Object.values(enumObj);
}

async function safeClear(Model, nome) {
  try {
    await Model.deleteMany();
    return true;
  } catch (err) {
    if (err.code === 8000 || err.codeName === "AtlasError" || err.message.includes("not allowed")) {
      console.log(`[AVISO] Sem permissão para limpar ${nome} -- inserindo sem limpar.`);
      return false;
    }
    throw err;
  }
}

async function safeInsert(Model, docs, nome) {
  try {
    const result = await Model.insertMany(docs, { ordered: false });
    return result;
  } catch (err) {
    const isDuplicate = err.code === 11000 || (err.writeErrors && err.writeErrors.every(e => e.code === 11000));
    if (isDuplicate) {
      console.log(`[AVISO] ${nome}: Alguns registros já existiam (duplicatas ignoradas).`);
      return Model.find();
    }
  }
}

async function seedUsuarios() {
  await safeClear(Usuario, "usuarios");
  const cargos = getValues(TIPO_USUARIO_ENUM);
  const statuses = getValues(STATUS_USUARIO_ENUM);

  const usuarios = [
    {
      nome: "Administrador Geral",
      cpf: "000.000.000-00",
      email: "admin@viveiro.com",
      telefone: "(11) 99999-9999",
      cargo: cargos.find(c => c.toLowerCase().includes('admin')) || cargos[0],
      senha: senhaHash,
      status: statuses.find(s => s.toLowerCase().includes('ativo')) || statuses[0],
    },
    {
      nome: "Operador Viveiro",
      cpf: "111.111.111-11",
      email: "operador@viveiro.com",
      telefone: "(11) 98888-8888",
      cargo: cargos.find(c => c.toLowerCase().includes('operador')) || cargos[0],
      senha: senhaHash,
      status: statuses.find(s => s.toLowerCase().includes('ativo')) || statuses[0],
    },
    {
      nome: "Admin Teste",
      cpf: "222.222.222-22",
      email: "teste@viveiro.com",
      telefone: "(11) 97777-7777",
      cargo: cargos.find(c => c.toLowerCase().includes('admin')) || cargos[0],
      senha: senhaHash,
      status: statuses.find(s => s.toLowerCase().includes('ativo')) || statuses[0],
    }
  ];

  for (let i = 0; i < 5; i++) {
    usuarios.push({
      nome: faker.name.firstName() + " " + faker.name.lastName(),
      cpf: faker.br.cpf(),
      email: faker.internet.email().toLowerCase(),
      telefone: faker.phone.phoneNumber(),
      cargo: pick(cargos),
      senha: senhaHash,
      status: pick(statuses),
    });
  }

  const result = await safeInsert(Usuario, usuarios, "Usuarios");
  console.log(`[OK] ${Array.isArray(result) ? result.length : 'N'} Usuários inseridos`);
  return await Usuario.find();
}

async function seedEspecies() {
  await safeClear(Especie, "especies");
  const especies = [
    {
      nome_popular: "Ipê Amarelo",
      nome_cientifico: "Handroanthus albus",
      variedade: "Comum",
      categoria: getValues(CATEGORIA_ESPECIE_ENUM)[0],
      tipo: getValues(TIPO_ESPECIE_ENUM)[0],
      status: getValues(STATUS_ESPECIE_ENUM).find(s => s.toUpperCase() === 'ATIVO') || getValues(STATUS_ESPECIE_ENUM)[0],
      quantidade_atual: 150,
      anotacoes: "Planta de sol pleno."
    },
    {
      nome_popular: "Manga Tommy",
      nome_cientifico: "Mangifera indica",
      variedade: "Tommy Atkins",
      categoria: getValues(CATEGORIA_ESPECIE_ENUM)[1] || getValues(CATEGORIA_ESPECIE_ENUM)[0],
      tipo: getValues(TIPO_ESPECIE_ENUM)[1] || getValues(TIPO_ESPECIE_ENUM)[0],
      status: getValues(STATUS_ESPECIE_ENUM).find(s => s.toUpperCase() === 'ATIVO') || getValues(STATUS_ESPECIE_ENUM)[0],
      quantidade_atual: 500,
      anotacoes: "Boa taxa de germinação."
    }
  ];

  const result = await safeInsert(Especie, especies, "Especies");
  console.log(`[OK] ${Array.isArray(result) ? result.length : 'N'} Espécies inseridas`);
  return await Especie.find();
}

async function seedEstufas() {
  await safeClear(Estufa, "estufas");
  const estufas = [];
  for (let i = 1; i <= 3; i++) {
    estufas.push({
      codigo_identificador: `E01-B0${i}-01`,
      localizacao_estufa: "E01",
      localizacao_barraca: `B0${i}`,
      localizacao_posicao: "01",
      capacidade_total: 1000,
      status: STATUS_ESTUFA.Livre
    });
  }
  const result = await safeInsert(Estufa, estufas, "Estufas");
  console.log(`[OK] ${Array.isArray(result) ? result.length : 'N'} Estufas inseridas`);
  return await Estufa.find();
}

async function seedDestinatarios() {
  await safeClear(Destinatario, "destinatarios");
  const destinatarios = [];
  const tipos = getValues(TIPO_PESSOA_ENUM);
  const categorias = getValues(CATEGORIA_USUARIO_ENUM);

  for (let i = 0; i < 5; i++) {
    const isFisica = Math.random() > 0.5;
    destinatarios.push({
      nome: isFisica ? faker.name.firstName() + " " + faker.name.lastName() : faker.company.companyName(),
      email: faker.internet.email().toLowerCase(),
      telefone: faker.phone.phoneNumber(),
      documento: isFisica ? faker.br.cpf() : faker.br.cnpj(),
      tipo: isFisica && tipos.includes('Física') ? 'Física' : tipos[0],
      categoria: pick(categorias),
      status: STATUS_DESTINATARIO.Ativo,
      endereco: faker.address.streetAddress(),
    });
  }
  const result = await safeInsert(Destinatario, destinatarios, "Destinatarios");
  console.log(`[OK] ${Array.isArray(result) ? result.length : 'N'} Destinatários inseridos`);
  return await Destinatario.find();
}

async function seedLotes(especies, estufas) {
  await safeClear(Lote, "lotes");
  const lotes = [];

  if (estufas && estufas.length > 0 && especies && especies.length > 0) {
    const estufaLivre = estufas.find(e => e.status === STATUS_ESTUFA.Livre) || estufas[0];
    const especie = especies[0];

    lotes.push({
      codigo: `LOTE-001`,
      itens_especies: [{
        especie_id: especie._id,
        quantidade_inicial: 200,
        quantidade_atual: 180
      }],
      estufa_id: estufaLivre._id,
      fase: FASE_LOTE.Semeadura,
      status: STATUS.Ativo,
      data_inicio: new Date()
    });
  } else {
    console.log("[AVISO] Lotes não foram gerados pois não há espécies ou estufas cadastradas.");
  }
  const result = await safeInsert(Lote, lotes, "Lotes");
  console.log(`[OK] ${Array.isArray(result) ? result.length : 'N'} Lotes inseridos`);
  return await Lote.find();
}

async function seedMovimentacoes(usuarios, especies, lotes, destinatarios) {
  await safeClear(Movimentacao, "movimentacoes");
  const movimentacoes = [];
  const admin = usuarios[0];
  const especie = especies[0];
  const lote = lotes[0];
  const destinatario = destinatarios[0];

  if (especie && admin && destinatario) {
    movimentacoes.push({
      tipo: TIPO_MOVIMENTACAO.Entrada,
      especie_id: especie._id,
      usuario_id: admin._id,
      quantidade: 1000,
      justificativa: "Aquisição inicial de sementes via fornecedor",
    });

    movimentacoes.push({
      tipo: TIPO_MOVIMENTACAO.Saida,
      especie_id: especie._id,
      usuario_id: admin._id,
      quantidade: 200,
      justificativa: "Saída de sementes para plantio no LOTE-001",
    });

    movimentacoes.push({
      tipo: TIPO_MOVIMENTACAO.Ajuste,
      especie_id: especie._id,
      usuario_id: admin._id,
      quantidade: -10,
      justificativa: "Ajuste de inventário (sementes mofadas descartadas da prateleira)",
    });
  }

  if (lote && admin && destinatario) {
    movimentacoes.push({
      tipo: TIPO_MOVIMENTACAO.Mortalidade,
      especie_id: lote.itens_especies?.[0]?.especie_id || especie._id,
      lote_id: lote._id,
      usuario_id: admin._id,
      quantidade: 20,
      justificativa: "Mortalidade na estufa devido à pragas/fungos",
    });

    movimentacoes.push({
      tipo: TIPO_MOVIMENTACAO.Expedicao,
      especie_id: lote.itens_especies?.[0]?.especie_id || especie._id,
      lote_id: lote._id,
      usuario_id: admin._id,
      destinatario_id: destinatario._id,
      quantidade: 50,
      justificativa: "Expedição de mudas para plantio em praça pública",
    });
  }

  const result = await safeInsert(Movimentacao, movimentacoes, "Movimentações");
  console.log(`[OK] ${Array.isArray(result) ? result.length : 'N'} Movimentações inseridas`);
  return await Movimentacao.find();
}

async function seedLogAuditoria(usuarios, especies) {
  await safeClear(LogAuditoria, "logAuditorias");
  const auditorias = [];
  const admin = usuarios[0];
  const acoes = getValues(AUDITORIA_ACOES);
  const entidades = getValues(AUDITORIA_ENTIDADES);

  if (admin && especies.length > 0) {
    auditorias.push({
      usuario_id: admin._id,
      acao: acoes[0],
      detalhes_mudanca: {
        entidade: entidades[0],
        entidade_id: especies[0]._id,
        nome: especies[0].nome
      }
    });
  }

  const result = await safeInsert(LogAuditoria, auditorias, "LogAuditoria");
  console.log(`[OK] ${Array.isArray(result) ? result.length : 'N'} Logs de Auditoria inseridos`);
  return await LogAuditoria.find();
}

export async function seedAll() {
  const usuarios = await seedUsuarios();
  const especies = await seedEspecies();
  const estufas = await seedEstufas();
  const destinatarios = await seedDestinatarios();
  const lotes = await seedLotes(especies, estufas);
  const movimentacoes = await seedMovimentacoes(usuarios, especies, lotes, destinatarios);
  const logAuditorias = await seedLogAuditoria(usuarios, especies);

  return { usuarios, especies, estufas, destinatarios, lotes, movimentacoes, logAuditorias };
}

async function run() {
  console.log("\nSeed Viveiro Municipal -- Iniciando...\n");
  console.log(`   Senha de teste (para Admin): ${SENHA_PURA}\n`);

  await DbConnect.conectar();

  const dados = await seedAll();

  const total = Object.values(dados).reduce((acc, curr) => acc + (curr ? curr.length : 0), 0);

  console.log("\n───────────────────────────────────────");
  console.log(`Seed concluído! ~${total} documentos inseridos.`);
  console.log("───────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  run().catch((err) => {
    console.error("[ERRO] Erro no seed:", err);
    process.exit(1);
  });
}