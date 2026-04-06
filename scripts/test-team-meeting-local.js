#!/usr/bin/env node
// scripts/test-team-meeting-local.js
// Local test of AI Employee Team Meeting (without Step Functions)

const path = require('path');

// Mock company context
const mockCompanyContext = {
  company_stage: 'seed',
  industry: 'B2B SaaS',
  runway_months: 8,
  monthly_burn: 30000,
  mrr: 15000,
  growth_rate_mom: 20,
  team_size: 5,
  tech_stack: {
    frontend: ['React', 'TypeScript', 'Tailwind'],
    backend: ['Node.js', 'Supabase'],
    infrastructure: ['Vercel', 'AWS'],
  },
  financials: {
    runway_months: 8,
    monthly_burn: 30000,
    mrr: 15000,
    arr: 180000,
    cac: 500,
    ltv: 3000,
  },
  sales: {
    pipeline_value: 50000,
    avg_deal_size: 5000,
    close_rate: 0.3,
    sales_cycle_days: 30,
  },
  product: {
    mau: 500,
    retention_rate: 0.85,
    nps: 45,
  },
};

const mockPastDecisions = [
  {
    question: 'Should we raise funding or bootstrap?',
    decision: 'Bootstrap to $500K ARR then raise',
    timestamp: '2025-11-15',
  },
];

async function testTeamMeeting() {
  console.log('🚀 Testing AI Employee Team Meeting (Local)\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const question = process.argv[2] || 'Should we add enterprise features or focus on SMB growth?';

  console.log(`📝 QUESTION: ${question}\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Step 1: Call all AI employees in parallel
    console.log('👥 INTERNAL TEAM MEETING (Parallel Calls)\n');

    const employeeRoles = ['CEO', 'CTO', 'CFO', 'VP_SALES', 'HEAD_OF_PRODUCT'];

    const employeeCaller = require('../lambdas/ai-employee-caller');

    const employeePromises = employeeRoles.map(async (role) => {
      console.log(`  🤖 Calling ${role}...`);
      const result = await employeeCaller.handler({
        employee_role: role,
        question,
        company_context: mockCompanyContext,
        past_decisions: mockPastDecisions,
      });
      return result.body;
    });

    const employeeResponses = await Promise.all(employeePromises);

    console.log('\n✅ Team responses received\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Print each response
    employeeResponses.forEach(r => {
      console.log(`💬 ${r.employee_name} (${r.employee_role}):`);
      console.log(`   ${r.response.substring(0, 200)}...`);
      console.log();
    });

    console.log('═══════════════════════════════════════════════════════════\n');

    // Step 2: Analyze consensus
    console.log('🎯 CEO ANALYZING CONSENSUS...\n');

    const consensusAnalyzer = require('../lambdas/consensus-analyzer');
    const consensusResult = await consensusAnalyzer.handler({
      question,
      employee_responses: employeeResponses,
      company_context: mockCompanyContext,
    });

    console.log(`📊 Consensus Score: ${consensusResult.body.consensusScore}%`);
    console.log(`📋 Rationale: ${consensusResult.body.rationale}`);
    console.log(`🎯 Needs Board: ${consensusResult.body.needsBoard ? 'YES' : 'NO'}\n`);

    if (consensusResult.body.needsBoard) {
      console.log(`📢 Board Advisors Recommended: ${consensusResult.body.recommendedAdvisors.join(', ')}`);
      console.log(`❓ Specific Question: ${consensusResult.body.specificQuestion}\n`);
    }

    console.log('═══════════════════════════════════════════════════════════\n');

    // Step 3: Consult board if needed
    let boardResponses = [];
    if (consensusResult.body.needsBoard) {
      console.log('🐻 CONSULTING ADVISORY BOARD...\n');

      const boardAdvisorCaller = require('../lambdas/board-advisor-caller');

      const boardPromises = consensusResult.body.recommendedAdvisors.slice(0, 3).map(async (advisorId) => {
        console.log(`  🐻 Calling ${advisorId}...`);
        const result = await boardAdvisorCaller.handler({
          advisor_id: advisorId,
          question: consensusResult.body.specificQuestion,
          company_context: mockCompanyContext,
          internal_team_discussion: employeeResponses.map(r => `${r.employee_name}: ${r.response}`).join('\n\n'),
        });
        return result.body;
      });

      boardResponses = await Promise.all(boardPromises);

      console.log('\n✅ Board responses received\n');
      console.log('═══════════════════════════════════════════════════════════\n');

      boardResponses.forEach(r => {
        if (r && r.advisor_name) {
          console.log(`🐻 ${r.advisor_name} (${r.advisor_role}):`);
          console.log(`   ${r.response ? r.response.substring(0, 200) : '[No response]'}...`);
          console.log();
        }
      });

      console.log('═══════════════════════════════════════════════════════════\n');
    }

    // Step 4: CEO Final Synthesis
    console.log('🎯 CEO FINAL SYNTHESIS...\n');

    const ceoSynthesizer = require('../lambdas/ceo-synthesizer');
    const finalDecision = await ceoSynthesizer.handler({
      question,
      employee_responses: employeeResponses,
      board_responses: boardResponses,
      company_context: mockCompanyContext,
    });

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('🎉 FINAL DECISION\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    const decision = finalDecision.body;

    console.log(`✅ DECISION: ${decision.decision}\n`);
    console.log(`📋 RATIONALE:\n${decision.rationale}\n`);
    console.log(`💡 KEY INSIGHTS:`);
    decision.key_insights?.forEach((insight, i) => {
      console.log(`   ${i + 1}. ${insight}`);
    });
    console.log();

    if (decision.action_items?.length > 0) {
      console.log(`📈 ACTION ITEMS:`);
      decision.action_items.forEach((item, i) => {
        console.log(`   [ ] ${item.assignee}: ${item.action} (${item.deadline})`);
      });
      console.log();
    }

    console.log(`🎚️  Confidence: ${decision.confidence_level}`);
    console.log(`📅 Follow-up: ${decision.follow_up_date || 'TBD'}\n`);

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('✅ Test Complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testTeamMeeting();
