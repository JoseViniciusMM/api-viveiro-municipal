import { describe, it, expect } from "@jest/globals";
import EstufaFilterBuilder from "../../../repositories/filters/estufaFilterBuilder.js";
import DestinatarioFilterBuilder from "../../../repositories/filters/destinatarioFilterBuilder.js";
import MovimentacaoFilterBuilder from "../../../repositories/filters/movimentacaoFilterBuilder.js";
import UsuarioFilterBuilder from "../../../repositories/filters/usuarioFilterBuilder.js";
import LogAuditoriaFilterBuilder from "../../../repositories/filters/LogAuditoriaFilterBuilder.js";
import LoteFilterBuilder from "../../../repositories/filters/LoteFilterBuilder.js";

describe("Testes Unitários — Construtores de Filtros do Sistema", () => {

    describe("EstufaFilterBuilder", () => {
        it("Deve exercitar todas as ramificações com valores preenchidos (Truthy)", () => {
            const builder = new EstufaFilterBuilder()
                .comBusca("E01")
                .comLocalizacaoEstufa("02")
                .comLocalizacaoBarraca("B01")
                .comLocalizacaoPosicao("01")
                .comStatus("Livre")
                .comCapacidadeMinima(100)
                .comCapacidadeMaxima(2000);

            const query = builder.build();
            expect(query).toBeDefined();
        });

        it("Deve exercitar as ramificações vazias (Falsy/Else)", () => {
            const builder = new EstufaFilterBuilder()
                .comBusca(undefined)
                .comLocalizacaoEstufa(undefined)
                .comLocalizacaoBarraca(undefined)
                .comLocalizacaoPosicao(undefined)
                .comStatus(undefined)
                .comCapacidadeMinima(undefined)
                .comCapacidadeMaxima(undefined);

            const query = builder.build();
            expect(query).toEqual({});
        });
    });

    describe("DestinatarioFilterBuilder", () => {
        it("Deve exercitar todas as ramificações com valores preenchidos (Truthy)", () => {
            const builder = new DestinatarioFilterBuilder()
                .comNome("João")
                .comTipo("Física")
                .comEmail("joao@teste.com")
                .comCategoria("Cliente")
                .comDocumento("123456")
                .comStatus("Ativo");

            const query = builder.build();
            expect(query.nome).toHaveProperty("$regex");
            expect(query.email).toHaveProperty("$regex");
            expect(query.documento).toHaveProperty("$regex");
            expect(query.tipo).toBe("Física");
        });

        it("Deve exercitar as ramificações vazias (Falsy/Else)", () => {
            const builder = new DestinatarioFilterBuilder()
                .comNome(null)
                .comTipo(null)
                .comEmail(null)
                .comCategoria(null)
                .comDocumento(null)
                .comStatus(null);

            const query = builder.build();
            expect(query).toEqual({});
        });
    });

    describe("MovimentacaoFilterBuilder", () => {
        it("Deve exercitar todas as ramificações com valores preenchidos (Truthy)", () => {
            const builder = new MovimentacaoFilterBuilder()
                .comTipo("Entrada")
                .comEspecie("esp-123")
                .comUsuario("usr-999")
                .comLote("lot-777")
                .comDestinatario("dest-555")
                .comPeriodo("2026-01-01", "2026-06-01");

            const query = builder.build();
            expect(query.tipo).toBe("Entrada");
            expect(query.especie_id).toBe("esp-123");
            expect(query.data_registro).toHaveProperty("$gte");
        });

        it("Deve exercitar as ramificações vazias ou incompletas (Falsy/Else)", () => {
            const builder = new MovimentacaoFilterBuilder()
                .comTipo(undefined)
                .comEspecie(undefined)
                .comUsuario(undefined)
                .comLote(undefined)
                .comDestinatario(undefined)
                .comPeriodo(undefined, undefined); 

            const query = builder.build();
            expect(query).toEqual({});
        });
    });

    describe("UsuarioFilterBuilder", () => {
        it("Deve exercitar todas as ramificações com valores preenchidos (Truthy)", () => {
            const builder = new UsuarioFilterBuilder()
                .comNome("Carlos")
                .comCpf("123.456.789-00")
                .comCargo("Administrador")
                .comStatus("Ativo");

            const query = builder.build();

            expect(query.nome).toHaveProperty("$regex", "Carlos");
            expect(query.cpf).toHaveProperty("$regex", "123.456.789-00");
            expect(query.cargo).toBe("Administrador");
            expect(query.status).toBe("Ativo");
        });

        it("Deve exercitar todas as ramificações vazias (Falsy/Else)", () => {
            const builder = new UsuarioFilterBuilder()
                .comNome(undefined)
                .comCpf(undefined)
                .comCargo(undefined)
                .comStatus(undefined);

            const query = builder.build();
            expect(query).toEqual({});
        });
    });

    describe("LogAuditoriaFilterBuilder", () => {
        it("Deve exercitar os campos básicos preenchidos (Truthy)", () => {
            const builder = new LogAuditoriaFilterBuilder()
                .comUsuario("60c72b2f9b1d8b2bad111111")
                .comAcao("criar")
                .comEntidade("Estufa")
                .comEntidadeId("60c72b2f9b1d8b2bad222222");

            const query = builder.build();

            expect(query.usuario_id).toBe("60c72b2f9b1d8b2bad111111");
            expect(query.acao).toBe("criar");
            expect(query.entidade).toBe("Estufa");
            expect(query.entidade_id).toBe("60c72b2f9b1d8b2bad222222");
        });

        it("Deve cobrir todas as combinações de ramos de data do comPeriodo", () => {

            const queryAmbos = new LogAuditoriaFilterBuilder()
                .comPeriodo("2026-01-01", "2026-01-31")
                .build();
            expect(queryAmbos.data_registro).toHaveProperty("$gte");
            expect(queryAmbos.data_registro).toHaveProperty("$lte");

            const queryInicio = new LogAuditoriaFilterBuilder()
                .comPeriodo("2026-01-01", undefined)
                .build();
            expect(queryInicio.data_registro).toHaveProperty("$gte");
            expect(queryInicio.data_registro.$lte).toBeUndefined();

            const queryFim = new LogAuditoriaFilterBuilder()
                .comPeriodo(undefined, "2026-01-31")
                .build();
            expect(queryFim.data_registro).toBeDefined();
            expect(queryFim.data_registro.$gte).toBeUndefined();
            expect(queryFim.data_registro).toHaveProperty("$lte");
        });

        it("Deve exercitar todas as ramificações vazias (Falsy/Else)", () => {
            const builder = new LogAuditoriaFilterBuilder()
                .comUsuario(null)
                .comAcao(null)
                .comEntidade(null)
                .comEntidadeId(null)
                .comPeriodo(undefined, undefined);

            const query = builder.build();
            expect(query).toEqual({});
        });
    });

    describe("LoteFilterBuilder", () => {
        it("Deve exercitar todas as ramificações preenchidas incluindo a busca por $or", () => {
            const builder = new LoteFilterBuilder()
                .comBusca("LOT-001")
                .comEspecie("60c72b2f9b1d8b2bad333333")
                .comEstufa("60c72b2f9b1d8b2bad444444")
                .comFase("Germinação")
                .comStatus("Ativo")
                .comPeriodo("2026-01-01", "2026-06-01");

            const query = builder.build();

            expect(query.$or).toBeDefined();
            expect(query.$or[0].codigo).toHaveProperty("$regex", "LOT-001");
            expect(query['itens_especies.especie_id']).toBe("60c72b2f9b1d8b2bad333333");
            expect(query.estufa_id).toBe("60c72b2f9b1d8b2bad444444");
            expect(query.fase).toBe("Germinação");
            expect(query.status).toBe("Ativo");
            expect(query.data_inicio).toHaveProperty("$gte");
        });

        it("Deve exercitar todas as ramificações vazias ou incompletas (Falsy/Else)", () => {
            const builder = new LoteFilterBuilder()
                .comBusca(undefined)
                .comEspecie(undefined)
                .comEstufa(undefined)
                .comFase(undefined)
                .comStatus(undefined)
                .comPeriodo("2026-01-01", undefined);

            const query = builder.build();
            expect(query).toEqual({});
        });
    });
});
