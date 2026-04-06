// lambdas/memory-updater/index.js
// Stores team meeting decisions to company memory (PostgreSQL + OpenSearch)

exports.handler = async (event) => {
  try {
    const {
      userId,
      question,
      decision,
      teamResponses = [],
      boardResponses = [],
    } = event;

    console.log(`[memory-updater] Storing decision for user ${userId}`);

    // TODO: Integrate with Supabase + OpenSearch
    // For now, just log and return success

    const memory Entry = {
      userId,
      question,
      decision: decision.decision,
      rationale: decision.rationale,
      team_consulted: teamResponses.map(r => r.employee_name),
      board_consulted: boardResponses.map(r => r.advisor_name),
      action_items: decision.action_items,
      timestamp: new Date().toISOString(),
    };

    console.log('[memory-updater] Would store:', JSON.stringify(memoryEntry, null, 2));

    // TODO Phase 2: Actually store to database
    // - Insert to PostgreSQL (company_decisions table)
    // - Generate embedding and store to OpenSearch
    // - Update user's company context

    return {
      statusCode: 200,
      body: {
        success: true,
        memory_id: `mem_${Date.now()}`,
        stored_at: new Date().toISOString(),
      }
    };

  } catch (error) {
    console.error('[memory-updater] Error:', error);
    return {
      statusCode: 500,
      body: {
        error: error.message,
      }
    };
  }
};
