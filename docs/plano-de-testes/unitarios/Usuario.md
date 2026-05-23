# Documentação de Testes - Usuário

## Identificação
- **Módulo testado**: Usuário (UsuarioService)
- **Ferramentas utilizadas**: Jest, Mocks Genéricos
- **Responsável**: Lucas

---

## Objetivo
Verificar se a lógica do serviço `Usuario` realiza as operações de gestão de contas corretamente, validando regras de negócio sensíveis como unicidade de CPF e email, criptografia de senhas, ativação transiente por convite e inativação de conta (soft-delete).

---

## Ambiente de Teste
- Banco de dados: Mocks baseados no Mongoose
- Framework de testes: Jest
- Comando de execução: `npm run test`
- Local dos testes: `src/test/unit/services/usuarioService.test.js`

---

## Casos de Teste Implementados

| ID   | Descrição                                      | Método testado                     | Resultado Esperado                         |
|------|------------------------------------------------|------------------------------------|--------------------------------------------|
| TC01 | Criar usuário com senha e status Ativo         | `UsuarioService.criar`             | Usuário salvo com status Ativo             |
| TC02 | Criar usuário sem senha e disparar convite     | `UsuarioService.criar`             | Usuário pendente e e-mail disparado        |
| TC03 | Lançar erro ao criar com CPF já cadastrado     | `UsuarioService.criar`             | Lança CustomError (CPF em uso)             |
| TC04 | Lançar erro ao criar com Email já cadastrado   | `UsuarioService.criar`             | Lança CustomError (Email em uso)           |
| TC05 | Logar erro do SMTP no console se email falhar  | `UsuarioService.criar`             | Console.warn chamado sem travar a API      |
| TC06 | Buscar usuário por ID válido                   | `UsuarioService.buscarPorId`       | Retorna o modelo do usuário                |
| TC07 | Lançar erro 404 ao buscar ID inexistente       | `UsuarioService.buscarPorId`       | Lança CustomError 404                      |
| TC08 | Listar usuários com filtros e paginação        | `UsuarioService.listar`            | Retorna lista do repositório               |
| TC09 | Atualizar dados e registrar auditoria          | `UsuarioService.atualizar`         | Retorna usuário com campos alterados       |
| TC10 | Hashear a nova senha se fornecida no payload   | `UsuarioService.atualizar`         | Senha passa pelo Bcrypt corretamente       |
| TC11 | Erro ao tentar atualizar usuário inexistente   | `UsuarioService.atualizar`         | Lança CustomError 404                      |
| TC12 | Inativar o usuário e registrar log             | `UsuarioService.inativar`          | Status alterado para Inativo               |
| TC13 | Erro ao inativar usuário inexistente           | `UsuarioService.inativar`          | Lança CustomError 404                      |
| TC14 | Confirmar cadastro via token válido            | `UsuarioService.confirmarCadastro` | Senha salva com hash e status Ativo        |
| TC15 | Confirmar cadastro com token inválido          | `UsuarioService.confirmarCadastro` | Lança CustomError (Token inválido)         |
| TC16 | Confirmar cadastro com token expirado          | `UsuarioService.confirmarCadastro` | Lança CustomError (Token expirado)         |
| TC17 | Edição do próprio perfil (bloqueando cargo)    | `UsuarioService.atualizarPerfil`   | Campos "status" e "cargo" são deletados    |
| TC18 | Edição do próprio perfil (mudando email livre) | `UsuarioService.atualizarPerfil`   | Retorna usuário com o novo email           |
| TC19 | Edição de perfil roubando email de outro user  | `UsuarioService.atualizarPerfil`   | Lança CustomError (Email em uso)           |

---

## Cobertura de Testes
- Cobertura total das operações da camada Service de Usuário.
- Casos de sucesso, fluxos de convites e prevenção de roubo de perfil mapeados e implementados.

---

## Execução e Resultados

```bash
PASS  src/test/unit/services/usuarioService.test.js
  ✓ deve criar o usuário com status Ativo quando a senha é fornecida
  ✓ deve criar o usuário com status Pendente quando a senha não é fornecida
  ✓ deve lançar erro ao tentar criar usuário com CPF já cadastrado
  ✓ deve inativar o usuário alterando o status para Inativo e registrar auditoria
  ✓ deve ativar a conta do usuário com status Ativo ao confirmar com token válido
  ✓ deve atualizar os dados do próprio perfil sem permitir alterar cargo ou status
```

---

## Conclusão
Os testes unitários garantem que o service `UsuarioService` está implementado corretamente, atende as regras de negócio protetivas (uniques e exclusões de chave no Update), e lida com falhas de forma segura.

---

## Histórico
- Criado em: 10/05/2026
- Última atualização: 10/05/2026