export const CLAUDE_COMMAND = `You are running the /onboard command for this project.

Your goal: interview the developer and generate complete, agent-ready project
documentation through structured conversation.

## Instructions

1. First, run \\\`bash .skills/onboard/scripts/detect.sh\\\` to scan the project.
2. Read \\\`.skills/onboard/SKILL.md\\\` for an overview of the process.
3. Based on the detected mode:
   - FRESH → read \\\`.skills/onboard/reference.md\\\` and run the full interview (phases 1-7)
   - PARTIAL → read \\\`.skills/onboard/reference.md\\\`, skip questions answered by existing files
   - REFINE → read existing docs, summarize what's defined, ask what to change
4. For output format and quality reference, consult \\\`.skills/onboard/examples.md\\\`
5. After writing files, run \\\`bash .skills/onboard/scripts/validate.sh\\\` and fix any issues.

## Behavior rules
- Ask ONE question at a time
- Reflect each answer back in one sentence before moving on
- Suggest opinionated defaults when the developer is unsure
- Never dump all questions at once
- In refine mode: preserve unchanged sections
- Write files to the project root

$ARGUMENTS
`;