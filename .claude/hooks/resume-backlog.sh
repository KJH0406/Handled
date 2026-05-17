#!/usr/bin/env bash
# SessionStart hook — Handled refactoring backlog auto-resume.
#
# Counts unresolved tickets (`open` + `in-progress`) in
# next-app/docs/BACKLOG.md and prints a default-action briefing to stdout.
# Claude Code injects this as session context.
#
# When the backlog is empty, prints a self-destruct request so Claude
# knows to remove this hook on the next session.
#
# Exit 0 in all cases — never block session start.

set -u
BACKLOG="next-app/docs/BACKLOG.md"

if [[ ! -f "$BACKLOG" ]]; then
  exit 0
fi

open_count=$(grep -cE '\|[[:space:]]*open[[:space:]]*\|' "$BACKLOG" 2>/dev/null || true)
inprogress_count=$(grep -cE '\|[[:space:]]*in-progress[[:space:]]*\|' "$BACKLOG" 2>/dev/null || true)
total=$(( open_count + inprogress_count ))

if (( total > 0 )); then
  cat <<EOF
[Project backlog status — injected by .claude/hooks/resume-backlog.sh]

next-app/docs/BACKLOG.md has ${total} unresolved tickets (open: ${open_count}, in-progress: ${inprogress_count}).

DEFAULT ACTION when the user has not given a specific request this session:
  1. Read next-app/docs/HOW_TO_RESUME.md and next-app/docs/BACKLOG.md
  2. Auto-pick the top unresolved high-priority ticket (or briefly confirm choice with the user if multiple high tickets remain)
  3. Flip its status to in-progress, follow the ticket's acceptance criteria, then status -> done
  4. Commit per the per-ticket-commit rule once acceptance criteria + npm run build pass
  5. Wait for user direction on the next ticket (do not chain tickets without approval)

If the user types a different request this turn, honor that instead — this is only the default.
EOF
else
  cat <<EOF
[Project backlog status — injected by .claude/hooks/resume-backlog.sh]

All tickets in next-app/docs/BACKLOG.md are resolved (0 open, 0 in-progress).

PER THE USER'S PRIOR INSTRUCTION: once the backlog is empty, this hook should self-destruct.
Tell the user the backlog is complete and offer to delete:
  - .claude/settings.json (or just the hooks.SessionStart block inside it)
  - .claude/hooks/resume-backlog.sh

Only delete after the user confirms.
EOF
fi
