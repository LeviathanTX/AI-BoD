// lambdas/employee-selector/index.js
// Determines which AI employees should participate in this meeting

exports.handler = async (event) => {
  try {
    const { question, company_context = {} } = event;

    console.log(`[employee-selector] Selecting employees for: ${question.substring(0, 100)}...`);

    // For now, always include all 5 core employees
    // TODO Phase 2: Smart selection based on question type
    const selectedEmployees = [
      { role: 'CEO', name: 'Alex', rationale: 'Always participates as decision maker' },
      { role: 'CTO', name: 'Morgan', rationale: 'Technical perspective' },
      { role: 'CFO', name: 'Jordan', rationale: 'Financial perspective' },
      { role: 'VP_SALES', name: 'Taylor', rationale: 'Revenue/growth perspective' },
      { role: 'HEAD_OF_PRODUCT', name: 'Casey', rationale: 'Product/user perspective' },
    ];

    console.log(`[employee-selector] Selected ${selectedEmployees.length} employees`);

    return {
      statusCode: 200,
      body: {
        selected_employees: selectedEmployees,
        rationale: 'Full executive team participation for comprehensive input',
      }
    };

  } catch (error) {
    console.error('[employee-selector] Error:', error);
    return {
      statusCode: 500,
      body: {
        error: error.message,
        selected_employees: [],
      }
    };
  }
};
