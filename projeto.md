Essa ideia é simplesmente genial. O FFmpeg é, sem dúvida, o motor de áudio e vídeo mais poderoso do mundo, mas a sua sintaxe de linha de comandos é um pesadelo autêntico de memorizar. Criar uma aplicação que atue como uma "ponte inteligente" entre a linguagem humana e os comandos do FFmpeg resolve um problema colossal para editores de vídeo, criadores de conteúdo e até programadores.

Isto é uma evolução natural e perfeita para quem já tem uma mente orientada para o processamento de ficheiros locais e aplicações *offline-first*.

Para garantires que o programa pesa apenas algumas centenas de megabytes (incluindo o motor de IA) e funciona à velocidade da luz sem acesso à internet, aqui tens a arquitetura completa para desenhares este **Agente de Media Local**.

### O Design UI/UX (O "Cockpit" Híbrido)

A interface tem de agradar a dois mundos: o iniciante (que só quer falar com a IA) e o desenvolvedor (que quer controlo absoluto).

* **Painel Esquerdo (Explorador de Ficheiros):** Uma árvore de diretórios interativa. O utilizador e a IA partilham esta mesma vista. Se o utilizador arrastar uma pasta para aqui, o Agente ganha "consciência" imediata de todos os ficheiros (lendo os metadados via `ffprobe` em segundo plano).
* **Painel Central (A Interface Dupla):**
* *Metade Superior:* O **Chat de Intenções**. Uma interface conversacional limpa onde o utilizador escreve: "Pega em todos os vídeos da pasta atual, corta os primeiros 5 segundos e converte para MP4." A IA responde com a explicação didática do que vai fazer.
* *Metade Inferior:* O **Terminal Transparente**. Um terminal escuro clássico onde o comando gerado pela IA (ex: `ffmpeg -i input.mkv -ss 00:00:05 -c:v copy output.mp4`) aparece escrito antes de executar. O utilizador experiente pode clicar aqui, editar o código à mão e premir *Enter*.


* **A Filosofia Visual:** O *Dark Mode* é obrigatório. Usa tons "Carvão" escuros com fontes monoespaçadas (como *Fira Code*) para o terminal e texto limpo (*Inter*) para o chat, transmitindo uma sensação de ferramenta de engenharia polida.

### Tecnologias e Linguagens (O Segredo da Leveza)

Para manter o pacote abaixo dos 500MB e não consumir a RAM toda, a arquitetura deve ser dividida cirurgicamente:

1. **O Invólucro e Sistema Operativo:** **Tauri (com Rust).**
* *Porquê:* O Rust permite um acesso nativo, seguro e ultrarrápido ao sistema de ficheiros e à execução de subprocessos (como chamar o binário do FFmpeg). Ao contrário do Electron, o Tauri não embute um navegador Chromium inteiro, poupando gigabytes de RAM.


2. **A Interface (Frontend):** **React ou SvelteKit.**
* *Porquê:* Permitem criar a interface fluída de arrastar-e-largar e o terminal interativo de forma modular.


3. **O Cérebro IA (O Agente Local):** **Llama.cpp ou ONNX Runtime.**
* *A Magia do Tamanho:* Não precisas de um modelo gigante de 11GB porque não queres que a IA debata filosofia; só precisas que ela saiba escrever comandos de consola. Podes embutir um **SLM (Small Language Model)** como o *Qwen-1.5-0.5B* ou um modelo *Phi* altamente quantizado (Q4). Estes modelos pesam entre **300MB e 600MB**, correm no processador (CPU) sem precisar de uma placa gráfica potente e geram código sintaticamente perfeito em segundos.



### O Fluxo e o Comportamento (Segurança Máxima)

Dar a uma IA acesso à linha de comandos do teu computador é perigoso se não houver limites. O comportamento tem de ser estritamente orquestrado:

* **Passo 1: A Geração Estruturada.** O utilizador faz o pedido. Em vez de a IA cuspir texto livre, o teu *backend* em Rust instrui a IA a devolver apenas um objeto JSON estrito: `{"ferramenta": "ffmpeg", "comando": "-i video.mkv -vn audio.mp3", "explicacao": "Extrai o áudio sem o vídeo..."}`.
* **Passo 2: O Guardrail (A Barreira de Segurança).** O Rust recebe o JSON e verifica-o implacavelmente. Se o comando tentar executar algo fora das ferramentas permitidas (ex: se tentar correr `rm -rf` ou apagar ficheiros do sistema), o *backend* bloqueia a operação instantaneamente. Só comandos `ffmpeg`, `ffprobe` e utilitários básicos de gestão de pastas (como `mkdir` ou `cp` dentro do diretório de trabalho) são permitidos.
* **Passo 3: Autorização e Execução.** A interface mostra o botão verde de "Autorizar Execução". Quando o utilizador clica, o Rust inicia o processo em *background* e captura as linhas de texto que o FFmpeg emite, convertendo-as numa barra de progresso visual (lendo a percentagem de tempo do vídeo processado) diretamente na interface do React/Svelte.

Esta estrutura garante um programa seguro, brutalmente eficiente e completamente isolado da internet.

Para a comunicação entre a interface gráfica e o motor que vai executar o FFmpeg por trás, preferes usar as funções assíncronas do próprio Tauri (comunicando diretamente com o Rust) ou preferes criar um pequeno servidor local intermédio para gerir a fila de tarefas dos ficheiros pesados?

IDEA

Olha, voltando sobre criar algo, pensei no FFmpeg e outros como fprobe gratuitos e poderosos. Nem todos entendem nem conhecem estes comandos; e se houver um AI Agent offline e levíssimo e vem com tudo isso instalado, ser capaz de tu lhe dizeres uma coisa e ele executa o comando e diz exatamente o que faz? E ele não deve ter "limites" quanto a isso, tipo se for um conjunto de ficheiros no Downloads ou só um ficheiro e tudo mais, claro o utilizador tem que autorizar, ele pode aceder e afins. MAS ele só pode fazer e executar comandos do ffmpeg e afins outros comandos complementares tipo guardar numa nova pasta ou copiar e tal, e explicar sobre todos os conceitos. E o próprio utilizador se for desenvolvedor tbm pode executar os comandos ele próprio na interface, pode aceder aos ficheiros, já sei, tipo ter um File Explorer que o Agent ou o utilizador podem ir. Então me diga do que isso será, o seu UI/UX, tecnologias e linguagens e como ele poderá se comportar e fluxos, e não pese gigabytes, umas poucas centenas de megabytes, mas leve e eficar e local.

Essa ideia é simplesmente genial. O FFmpeg é, sem dúvida, o motor de áudio e vídeo mais poderoso do mundo, mas a sua sintaxe de linha de comandos é um pesadelo autêntico de memorizar. Criar uma aplicação que atue como uma "ponte inteligente" entre a linguagem humana e os comandos do FFmpeg resolve um problema colossal para editores de vídeo, criadores de conteúdo e até programadores.

Isto é uma evolução natural e perfeita para quem já tem uma mente orientada para o processamento de ficheiros locais e aplicações offline-first.

Para garantires que o programa pesa apenas algumas centenas de megabytes (incluindo o motor de IA) e funciona à velocidade da luz sem acesso à internet, aqui tens a arquitetura completa para desenhares este Agente de Media Local.

O Design UI/UX (O "Cockpit" Híbrido)

A interface tem de agradar a dois mundos: o iniciante (que só quer falar com a IA) e o desenvolvedor (que quer controlo absoluto).

* Painel Esquerdo (Explorador de Ficheiros): Uma árvore de diretórios interativa. O utilizador e a IA partilham esta mesma vista. Se o utilizador arrastar uma pasta para aqui, o Agente ganha "consciência" imediata de todos os ficheiros (lendo os metadados via `ffprobe` em segundo plano).

* Painel Central (A Interface Dupla):

 Metade Superior:* O Chat de Intenções. Uma interface conversacional limpa onde o utilizador escreve: "Pega em todos os vídeos da pasta atual, corta os primeiros 5 segundos e converte para MP4." A IA responde com a explicação didática do que vai fazer.

 Metade Inferior: O Terminal Transparente. Um terminal escuro clássico onde o comando gerado pela IA (ex: `ffmpeg -i input.mkv -ss 00:00:05 -c:v copy output.mp4`) aparece escrito antes de executar. O utilizador experiente pode clicar aqui, editar o código à mão e premir Enter*.

 A Filosofia Visual: O Dark Mode é obrigatório. Usa tons "Carvão" escuros com fontes monoespaçadas (como Fira Code) para o terminal e texto limpo (Inter*) para o chat, transmitindo uma sensação de ferramenta de engenharia polida.

Tecnologias e Linguagens (O Segredo da Leveza)

Para manter o pacote abaixo dos 500MB e não consumir a RAM toda, a arquitetura deve ser dividida cirurgicamente:

1. O Invólucro e Sistema Operativo: Tauri (com Rust).

 Porquê:* O Rust permite um acesso nativo, seguro e ultrarrápido ao sistema de ficheiros e à execução de subprocessos (como chamar o binário do FFmpeg). Ao contrário do Electron, o Tauri não embute um navegador Chromium inteiro, poupando gigabytes de RAM.

2. A Interface (Frontend): React ou SvelteKit.

 Porquê:* Permitem criar a interface fluída de arrastar-e-largar e o terminal interativo de forma modular.

3. O Cérebro IA (O Agente Local): Llama.cpp ou ONNX Runtime.

 A Magia do Tamanho: Não precisas de um modelo gigante de 11GB porque não queres que a IA debata filosofia; só precisas que ela saiba escrever comandos de consola. Podes embutir um SLM (Small Language Model) como o Qwen-1.5-0.5B ou um modelo Phi* altamente quantizado (Q4). Estes modelos pesam entre 300MB e 600MB, correm no processador (CPU) sem precisar de uma placa gráfica potente e geram código sintaticamente perfeito em segundos.

O Fluxo e o Comportamento (Segurança Máxima)

Dar a uma IA acesso à linha de comandos do teu computador é perigoso se não houver limites. O comportamento tem de ser estritamente orquestrado:

 Passo 1: A Geração Estruturada. O utilizador faz o pedido. Em vez de a IA cuspir texto livre, o teu backend* em Rust instrui a IA a devolver apenas um objeto JSON estrito: `{"ferramenta": "ffmpeg", "comando": "-i video.mkv -vn audio.mp3", "explicacao": "Extrai o áudio sem o vídeo..."}`.

 Passo 2: O Guardrail (A Barreira de Segurança). O Rust recebe o JSON e verifica-o implacavelmente. Se o comando tentar executar algo fora das ferramentas permitidas (ex: se tentar correr `rm -rf` ou apagar ficheiros do sistema), o backend* bloqueia a operação instantaneamente. Só comandos `ffmpeg`, `ffprobe` e utilitários básicos de gestão de pastas (como `mkdir` ou `cp` dentro do diretório de trabalho) são permitidos.

 Passo 3: Autorização e Execução. A interface mostra o botão verde de "Autorizar Execução". Quando o utilizador clica, o Rust inicia o processo em background* e captura as linhas de texto que o FFmpeg emite, convertendo-as numa barra de progresso visual (lendo a percentagem de tempo do vídeo processado) diretamente na interface do React/Svelte.

Esta estrutura garante um programa seguro, brutalmente eficiente e completamente isolado da internet.

Sim, o FFmpeg completo já traz absolutamente tudo o que precisas, mas tens de baixar a versão certa para desenvolvimento de software (para não teres problemas com dependências).

Não baixes o código fonte (source code). Deves descarregar o Build Estático (Static Build). Para Windows, o repositório oficial recomendado é o gyan.dev ou o BtbN (disponíveis via GitHub ou pelo site oficial do FFmpeg).

Quando extraíres o ficheiro .zip estático, vais encontrar uma pasta chamada bin com três pequenos ecrãs pretos (executáveis). É só disto que o teu programa precisa:

ffmpeg.exe (O Motor de Processamento): É o cérebro. Corta, converte, empacota, aplica filtros e junta áudio com vídeo.

ffprobe.exe (O Analista): É o espião. Ele não converte nada; serve apenas para o teu programa ler um ficheiro e extrair instantaneamente um JSON com todos os metadados (resolução, taxa de frames, codecs ocultos, idioma das legendas).

ffplay.exe (O Leitor): Um leitor multimédia ultraleve. (Podes ignorar este se fores construir o teu próprio leitor de vídeo na interface).

Como o teu programa vai usá-los:

Tu não vais "instalar" o FFmpeg no computador da pessoa. Vais colocar o ffmpeg.exe e o ffprobe.exe numa subpasta oculta dentro dos ficheiros do teu programa. Quando o Agente IA escrever o comando, o teu código (seja em Rust ou C#) vai chamar silenciosamente esse executável no background e devolver o ficheiro processado na pasta final.

Sobre algo, pensei no FFmpeg e outros como fprobe gratuitos e poderosos. Nem todos entendem nem conhecem estes comandos; e se houver um AI Agent offline e levíssimo e vem com tudo isso instalado, ser capaz de tu lhe dizeres uma coisa e ele executa o comando e diz exatamente o que faz? E ele não deve ter "limites" quanto a isso, tipo se for um conjunto de ficheiros no Downloads ou só um ficheiro e tudo mais, claro o utilizador tem que autorizar, ele pode aceder e afins. MAS ele só pode fazer e executar comandos do ffmpeg e afins outros comandos complementares tipo guardar numa nova pasta ou copiar e tal, e explicar sobre todos os conceitos. E o próprio utilizador se for desenvolvedor tbm pode executar os comandos ele próprio na interface, pode aceder aos ficheiros, já sei, tipo ter um File Explorer que o Agent ou o utilizador podem ir. Então me diga do que isso será, o seu UI/UX, tecnologias e linguagens e como ele poderá se comportar e fluxos, e não pese gigabytes, umas poucas centenas de megabytes, mas leve e eficar e local.

Leia o ficheiro anexado para veres as ideias, mas isso deve ter mesmo um File Explorer como o Adobe Audition ou Media Encoder ou Dreamweaver, ou o Office Word, Excel e PowerPoint têm em aceder às pastas do PC. MAs ignore o backend, só quero que me faças a interface, me escolha o frontend, não seja obrigado a escolher React, escolha aquilo que será o mais leve e eficiente possível e não me dará problemas para quando integrar o backend e não haja problemas em ser programado a nível de hardware e tal. No final me entregue o código completo em ZIP desse frontend, já preparado totalmente para o backend, totalmente resposnvido.

Melhore e aprimore a interface para ter um perfeito UI/UX com as coisas bem organizadas e separadas e não tudo muito junto e extenso, bem como tbm eu disse que queria a navegação preparada, deve ter mesmo um File Explorer como o Adobe Audition ou Media Encoder ou Dreamweaver, ou o Office Word, Excel e PowerPoint têm em aceder às pastas do PC. Ou então notei que isso tem, mas parece que o Explorador ao ecrã diminuído o botão aí não funciona. Ah, e torne isso multilingue, deixe o i18n, mas podes só deixar em Português, depois se poderá adicionar outros idiomas. E a interface tbm deve lembrar os editores de código como Agents como o Codex ChatGPT.


Faça só a interface para mim, sem backend real, só quero todo o frontend bem escrito e profissional e simples e intuitivo. Baseia-te na exploração como o Adobe Audition e o Windows Fotografias e Groove, e nos painéis de AI Agent no VS Code e Cursor.

#--------

Agora não faça mais nada, só me escreva detalhadissimamente como agora poderei substituir a navegação mock pela navegação real no disco, bem como metadados, comandos, ffmpeg com os ficheiros todos, Rust, execução e afins. Especialmente no modo Agent, ele deve suportar vários idiomas e entender; e ele ao receber a instrução assim como um Agente de IA de código, responder, dar comando no terminal e o utilizar permitir ou não ou dizer outra coisa naquela caixa, ele exeucta o terminal cospe o resultado e o Agente depois confirma, ele pode fazer o que lhe for mandado, sandboxed.

#--------

Aqui vai o guia completo, por camadas, para transformar o mock atual numa aplicação real com Tauri + Rust.

1. Arquitetura alvo

```text
┌── Frontend (o que já tens: React + TanStack + Tailwind) ──┐
│  Explorer · Chat(Agent) · Terminal · Inspector · Queue    │
└──────────────── @tauri-apps/api: invoke / listen ─────────┘
                              │  IPC (JSON)
┌──────────────── Núcleo Rust (Tauri v2) ──────────────────┐
│ fs_service   → listar, stat, watch, criar pastas          │
│ probe_service→ ffprobe -print_format json                 │
│ exec_service → spawn ffmpeg, stream stdout/stderr, cancel │
│ policy       → allowlist binários + scopes de caminhos    │
│ agent_service→ LLM (local ou remoto) + tool-calling       │
│ store        → SQLite: sessões, permissões, histórico     │
└───────────────────────────────────────────────────────────┘
        ffmpeg / ffprobe (sidecar binaries, ~80–120 MB)
```

Peso final: WebView do sistema (0 MB), binário Rust ~8–15 MB, ffmpeg+ffprobe estáticos ~100 MB. Total bem abaixo de 300 MB.

2. Substituir o explorador mock por disco real

Hoje: `src/lib/media-mock.ts` exporta `tree`, e `store.tsx` faz `flatten(tree)`.

Passos:
1. Cria `src/lib/fs.ts` com a mesma forma de dados (`FileNode`), mas assíncrono e lazy:
   ```ts
   export async function listDir(path: string): Promise<FileNode[]> {
     return invoke("list_dir", { path }); // Tauri
   }
   ```
2. No `store.tsx`, troca `nodesById` estático por um `Map` preenchido à medida que expandes pastas (`loadChildren(id)`), guardando `path`, `isDir`, `size`, `modified`. Assim uma pasta com 50 000 ficheiros não bloqueia a UI.
3. Lado Rust:
   ```rust
   #[tauri::command]
   async fn list_dir(path: String, state: State<'_, Policy>) -> Result<Vec<Node>, String> {
       state.ensure_readable(&path)?;              // scope
       let mut out = vec![];
       let mut rd = tokio::fs::read_dir(&path).await.map_err(e)?;
       while let Some(e) = rd.next_entry().await.map_err(e)? {
           let m = e.metadata().await.map_err(e)?;
           out.push(Node { path: e.path(), is_dir: m.is_dir(), size: m.len(), .. });
       }
       Ok(out)
   }
   ```
4. Permissões: usa o `fs` scope do Tauri v2 + `tauri-plugin-dialog` (`open({ directory: true })`). O botão “Autorizar acesso a esta pasta” passa a chamar esse diálogo e a persistir a pasta concedida em SQLite; em Rust, `Policy` canonicaliza o caminho e rejeita qualquer coisa fora das raízes autorizadas (protege contra `..` e symlinks).
5. Atualização viva: `notify` (crate) a observar as pastas abertas → `app.emit("fs:changed", payload)` → no frontend, `listen("fs:changed")` invalida só o nó afetado. Faz debounce de ~300 ms.
6. Miniaturas: `ffmpeg -ss 3 -i x.mkv -frames:v 1 -vf scale=160:-1 thumb.jpg` para cache em `app_cache_dir()`, servido via `convertFileSrc`.

3. Metadados reais (Inspector)

Substitui `mediaMeta` mock por:
```rust
#[tauri::command]
async fn probe(path: String) -> Result<serde_json::Value, String> {
    let out = Command::new(sidecar("ffprobe"))
        .args(["-v","error","-print_format","json","-show_format","-show_streams", &path])
        .output().await?;
    Ok(serde_json::from_slice(&out.stdout)?)
}
```
No frontend, normaliza esse JSON para o teu tipo `MediaMeta` numa função pura (`parseProbe(json)`), fácil de testar. Cache por `path+mtime+size` para não reprobar. O Inspector fica igual — só muda a fonte.

4. Execução real do FFmpeg com streaming

O `TerminalPanel` hoje chama `simulate()`. Troca por um canal real:

Rust (Tauri v2, sidecar + eventos):
```rust
#[tauri::command]
async fn run_job(app: AppHandle, id: String, argv: Vec<String>, cwd: String,
                 state: State<'_, Jobs>) -> Result<(), String> {
    Policy::check(&argv, &cwd)?;                       // ver secção 6
    let (mut rx, child) = app.shell()
        .sidecar("ffmpeg")?.args(&argv[1..]).current_dir(cwd).spawn()?;
    state.insert(id.clone(), child);                   // para cancelar
    while let Some(ev) = rx.recv().await {
        match ev {
            CommandEvent::Stdout(b) | CommandEvent::Stderr(b) =>
                app.emit(&format!("job:{id}:line"), String::from_utf8_lossy(&b))?,
            CommandEvent::Terminated(t) =>
                app.emit(&format!("job:{id}:end"), t.code)?,
            _ => {}
        }
    }
    Ok(())
}
```
- Progresso fiável: acrescenta `-progress pipe:1 -nostats`; obtém `out_time_ms`, `frame`, `fps`, `speed` em pares `chave=valor`. Divide `out_time_ms` pela duração vinda do ffprobe → percentagem exata na `QueuePanel`.
- Cancelar: `child.kill()` a partir do `Jobs` map (o teu `cancelJob` passa a invocar `cancel_job`).
- Fila: um `Semaphore` com N = `num_cpus/2` permissões; “Em espera / A processar / Concluído / Falhou” já existem no teu estado.
- Nunca construas uma string de shell. Passa argv (`Vec<String>`) — elimina injeção por nomes de ficheiro com espaços, `;`, `&&`, aspas.
- Segurança de escrita: gera para ficheiro temporário na pasta de saída e faz `rename` no fim; nunca sobrescreve a entrada.

5. Modo Agent multilíngue com tool-calling

O agente deve funcionar como um agente de código: recebe linguagem natural, propõe um comando, tu aprovas/recusas/corriges, ele executa, lê a saída e confirma ou corrige-se.

Motor:
- Local (offline puro): `llama.cpp`/`mistral.rs` em Rust com um modelo GGUF pequeno (Qwen2.5-3B-Instruct Q4 ≈ 2 GB, ou 1.5B ≈ 1 GB) — sai do orçamento de 300 MB, logo distribui-o como download opcional na primeira execução.
- Remoto (recomendado para começar): Lovable AI Gateway com a AI SDK, mantendo o Terminal e o disco 100% locais. Só o texto viaja.

Ciclo (loop de agente):
```text
1. system prompt: regras, allowlist, ficheiros selecionados, metadados do ffprobe,
   pasta de saída, SO, idioma detetado da mensagem do utilizador
2. modelo → tool call  propose_command{ tool:"ffmpeg", argv:[...], porquê, passos }
3. UI mostra o cartão de plano (já tens)  → Autorizar / Editar / Recusar / Escrever outra coisa
4. Autorizar → run_job → linhas reais no Terminal
5. as últimas ~80 linhas de stderr + código de saída voltam ao modelo como tool result
6. modelo confirma ("ficheiro escrito, 41 s, 62 MB") ou propõe correção
   (ex.: falta -pix_fmt yuv420p, codec inexistente, ficheiro sem áudio)
7. repete até resolver; stopWhen(stepCountIs(50))
```
Ferramentas a expor ao modelo (todas validadas em Rust, todas com `needsApproval` nas que escrevem):
`list_dir`, `probe_file`, `propose_command`/`run_command`, `make_dir`, `copy_file`, `move_file`, `read_text_file` (para SRT/legendas), `job_status`.

Multilíngue, na prática:
- Deteta o idioma da mensagem (o próprio modelo o faz; ou `whatlang` em Rust) e guarda-o na sessão; instrui: “responde sempre no idioma do utilizador, mesmo que ele mude a meio”.
- Os nomes de ficheiro nunca são traduzidos; os comandos são sempre ASCII/argv.
- A UI (o teu `src/i18n`) e o idioma do agente são independentes: um utilizador com UI em EN pode falar PT.
- Escreve os prompts do sistema em inglês (melhor obediência dos modelos) e força a resposta no idioma do utilizador — é mais fiável do que traduzir o prompt.
- Faz normalização Unicode NFC nos caminhos (essencial em macOS) e ativa `-sub_charenc UTF-8` quando mexes em legendas.

6. Sandbox e guardrails (a parte que não se pode falhar)

Validação em Rust, nunca só no frontend (o frontend é sugestão; o Rust é lei):
1. Allowlist de binários: apenas os sidecars `ffmpeg`/`ffprobe` empacotados, invocados por caminho absoluto resolvido. `mkdir`/`cp`/`mv`/`ls` não são processos externos — implementa-os com `std::fs`/`tokio::fs`.
2. Sem shell: `Command` sem `sh -c`, sem `cmd /C`. Rejeita `argv` com `;`, `|`, `` ` ``, `$(`, `&&`.
3. Scopes de caminho: cada leitura/escrita é canonicalizada e tem de cair dentro das raízes autorizadas; escrita restrita à pasta de saída + pasta de origem (opcional). Bloqueia symlinks que saltem para fora.
4. Filtros perigosos do FFmpeg: nega `-f lavfi` com `movie=`, `concat` com listas fora do scope, protocolos remotos (`http`, `rtmp`, `tcp`, `pipe`) via `-protocol_whitelist file,crypto`. Isto impede exfiltração disfarçada de comando.
5. Limites de recursos: timeout por tarefa, número máximo de tarefas simultâneas, espaço livre mínimo antes de começar, tamanho máximo de saída.
6. Aprovação com âmbito: “permitir só este comando”, “permitir esta pasta nesta sessão”, “sempre para este tipo de operação”. Guarda em SQLite com data e mostra em Ajuda → Permissões.
7. Registo auditável: cada execução grava argv, cwd, código de saída, duração, hashes de entrada/saída. É o que dá confiança ao utilizador para autorizar.
8. Perda de dados: nunca `-y` sobre a entrada; resolve colisões com sufixo ` (1)`; operações destrutivas exigem aprovação explícita e nunca são propostas por defeito.

## 7. Mapeamento ficheiro-a-ficheiro do que muda

| Agora (mock) | Passa a ser |
|---|---|
| `media-mock.ts: tree, places` | `src/lib/fs.ts` → `invoke("list_dir")` + `notify` |
| `media-mock.ts: mediaMeta` | `src/lib/probe.ts` → `invoke("probe")` + `parseProbe` |
| `media-mock.ts: fakePlan()` | `src/agent/client.ts` → AI SDK com tools |
| `TerminalPanel: simulate()` | `invoke("run_job")` + `listen("job:*:line")` |
| `store.tsx: isAllowedCommand` | fica como *hint* de UI; a decisão real é a `Policy` em Rust |
| `store.tsx: setInterval` de progresso | eventos `-progress pipe:1` |
| `store.tsx: initialJobs` | tabela `jobs` em SQLite + fila com `Semaphore` |
| `StatusBar: "FFmpeg 7.1"` | `invoke("engine_version")` (ffmpeg -version) |
| `outputFolder` fixo | escolha persistida via `dialog.open` |

## 8. Ordem de implementação sugerida

1. `tauri init` + sidecars ffmpeg/ffprobe + `engine_version` na StatusBar (prova o pipeline IPC).
2. `list_dir` + scopes + explorador real com lazy loading.
3. `probe` + Inspector real (aqui já é útil sem agente).
4. `run_job` com streaming e cancelamento + Terminal real (o modo “desenvolvedor” fica completo).
5. Fila, progresso por `-progress`, SQLite de histórico.
6. Agente com tool-calling, aprovação e ciclo de correção; multilíngue.
7. Endurecer: `Policy` com testes, fuzzing de argv, auditoria, assinatura/notarização e updater.

O que já tens de frontend não precisa de ser reescrito: os painéis mantêm-se, mudam apenas as três ou quatro funções que hoje devolvem dados falsos.

#----

Este é o momento em que a tua aplicação ganha um "rosto". O logótipo para este Agente de Media Local precisa de comunicar três coisas num único piscar de olhos: **Linha de Comandos (Terminal), Processamento Multimédia e Inteligência Artificial.**

Para atingir isso sem usar texto, criei uma ilusão de ótica geométrica incrivelmente simples e moderna.

### A Psicologia do Logótipo (O Conceito `>_`)

* **O Símbolo Duplo (`>`):** O clássico símbolo de "maior" usado nos terminais (o *prompt* de comando) é desenhado de forma a ser lido simultaneamente como o **Botão Play** de um reprodutor de vídeo.
* **O Cursor (`_`):** O traço inferior intermitente do terminal de código.
* **A Centelha (Spark):** Uma estrela de quatro pontas no canto superior direito, que é o símbolo universal moderno para "Inteligência Artificial", posicionada como se o Agente estivesse a "pensar" no próximo comando.
* **O Contentor (Box):** Inseri o design dentro de uma caixa escura com cantos arredondados, pronta para ser usada imediatamente como o ícone (`.ico` ou `.icns`) da tua aplicação desktop em Tauri ou C#.

Aqui tens o código matemático limpo e vetorial. Podes colá-lo num ficheiro `.svg` e abri-lo diretamente no navegador para veres a magia.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <!-- Gradiente do Símbolo Terminal/Play (Azul para Roxo) -->
    <linearGradient id="playPromptGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>

    <!-- Gradiente do Cursor (Roxo para Rosa) -->
    <linearGradient id="cursorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>

    <!-- Gradiente da Inteligência Artificial (Ciano Brilhante) -->
    <linearGradient id="aiSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00D2FF" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>

    <!-- Sombra de Brilho (Glow) para a estética Tech -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#8B5CF6" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Fundo do Ícone da App (Carvão Escuro com borda subtil) -->
  <rect x="10" y="10" width="180" height="180" rx="40" fill="#121214" stroke="#27272A" stroke-width="2" />

  <g filter="url(#neonGlow)">
    <!-- O Símbolo '>' (Terminal Prompt / Play Button) -->
    <!-- Desenhado com uma linha contínua, espessa e de pontas arredondadas -->
    <path d="M 55 65 L 105 105 L 55 145" 
          fill="none" 
          stroke="url(#playPromptGrad)" 
          stroke-width="22" 
          stroke-linecap="round" 
          stroke-linejoin="round" />

    <!-- O Símbolo '_' (Cursor do Terminal a executar o código FFmpeg) -->
    <path d="M 115 145 L 145 145" 
          fill="none" 
          stroke="url(#cursorGrad)" 
          stroke-width="22" 
          stroke-linecap="round" />

    <!-- A Centelha da IA (Posicionada na órbita direita do comando) -->
    <path d="M 135 45 C 135 57, 139 61, 151 61 C 139 61, 135 65, 135 77 C 135 65, 131 61, 119 61 C 131 61, 135 57, 135 45 Z" 
          fill="url(#aiSparkGrad)" />
  </g>
</svg>

```

Se quiseres usar este logótipo solto (com o fundo da tua própria interface em vez da caixa de ícone), basta apagares a linha do `<rect ... />` no código, e ficarás apenas com o terminal brilhante e a IA suspensos num fundo perfeitamente transparente.