#!/usr/bin/env node
// PreToolUse guard: refuses tool calls that would open a secrets file.
//
// Repo-committed counterpart to AGENTS.md's "Never read .env* files" rule —
// see that file for the full rule and its known gap. This turns the rule
// into an actual tool-call denial (not just a prompt instruction) for anyone
// who has this hook active, on any machine, for anyone who clones this
// public repo. It is opt-in, wired via .claude/settings.json in this repo.
//
// Deliberately public: this is a general-purpose filename guard with no
// repo secrets embedded in it, unlike the sensitive-name list subtask 7's
// prose check can't commit. Safe to ship in a public repo.
//
// Scope limit worth knowing, same as the equivalent user-global hook this
// mirrors: this only sees TOOL CALLS. An IDE text selection is injected into
// the model's context directly, so no hook can intercept it.

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0); // Fail open: a malformed payload must not wedge every tool call.
  }

  const ti = input.tool_input ?? {};
  const haystack = [
    ti.file_path,
    ti.path,
    ti.command,
    ti.pattern,
    ti.notebook_path,
  ]
    .filter((v) => typeof v === "string")
    .join(" ");

  // Template files are meant to be committed and read. Strip them BEFORE
  // matching so `cat .env.example .env.local` still trips on the second
  // path rather than being waved through because the string happened to
  // contain an allowed name.
  const scrubbed = haystack.replace(
    /\.env\.(example|sample|template|dist)\b/gi,
    "",
  );

  const SECRET_PATTERNS = [
    /(^|[\s"'`=/\\])\.env\b/i, // .env, .env.local, .env.production
    /(^|[\s"'`=/\\])\.envrc\b/i, // direnv
    /\b(id_rsa|id_ed25519|id_ecdsa)\b/i, // SSH private keys
    /\.(pem|pfx|p12|keystore|jks)\b/i, // certs / keystores
    /(^|[\s"'`=/\\])\.(npmrc|pypirc|netrc)\b/i, // registry + network credentials
    /(^|[\s"'`=/\\])\.aws\/credentials\b/i,
  ];

  if (SECRET_PATTERNS.some((re) => re.test(scrubbed))) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "Blocked by this repo's block-secret-files hook: this call targets a " +
            "secrets file (.env*, private key, or credential file). Per AGENTS.md's " +
            '"Never read .env* files" rule, never read these. Do NOT retry via ' +
            "another tool (Bash, Grep, a script) — that is the same violation. Ask " +
            "the person you're working with to paste only the specific non-secret " +
            "values you need.",
        },
      }),
    );
  }
  process.exit(0);
});
