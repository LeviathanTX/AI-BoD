// src/services/teamMeetingService.ts
// Service for AI Employee Team Meeting API Gateway integration

const API_GATEWAY_URL = 'https://6h3r5chsnh.execute-api.us-east-1.amazonaws.com/prod';

export interface TeamMeetingRequest {
  question: string;
  userId: string;
  poll?: boolean;
}

export interface TeamMeetingResponse {
  executionId: string;
  status: 'running' | 'completed' | 'failed';
  result?: TeamMeetingResult;
  error?: string;
}

export interface TeamMeetingResult {
  question: string;
  userId: string;
  finalDecision: {
    decision: string;
    rationale: string;
    confidence_level: 'low' | 'medium' | 'high';
    key_insights: string[];
    action_items: ActionItem[];
    contingencies: string[];
  };
  teamResponses: EmployeeResponse[];
  boardResponses?: BoardResponse[];
  consensusResult: {
    needsBoard: boolean;
    consensusScore: number;
    rationale: string;
  };
}

export interface ActionItem {
  assignee: string;
  action: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

export interface EmployeeResponse {
  employee_role: string;
  employee_name: string;
  response: string;
}

export interface BoardResponse {
  advisor_id: string;
  advisor_name: string;
  advisor_role: string;
  response: string;
}

export class TeamMeetingService {
  /**
   * Start a new team meeting (async mode)
   * Returns execution ID immediately
   */
  async startMeeting(request: TeamMeetingRequest): Promise<string> {
    console.log('[TeamMeetingService] Starting team meeting:', request.question);

    const response = await fetch(API_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        poll: false, // Always use async mode (API Gateway timeout limitation)
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[TeamMeetingService] API Gateway error:', error);
      throw new Error(`Failed to start team meeting: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.executionId) {
      throw new Error('API Gateway did not return execution ID');
    }

    console.log('[TeamMeetingService] Team meeting started:', data.executionId);
    return data.executionId;
  }

  /**
   * Poll for team meeting results
   * Uses AWS SDK to check Step Functions execution status
   */
  async pollForResult(executionArn: string, maxAttempts = 30): Promise<TeamMeetingResult> {
    console.log('[TeamMeetingService] Polling for results:', executionArn);

    // Import AWS SDK dynamically to reduce bundle size
    const { SFNClient, DescribeExecutionCommand } = await import('@aws-sdk/client-sfn');

    const sfn = new SFNClient({ region: 'us-east-1' });

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const status = await sfn.send(
          new DescribeExecutionCommand({
            executionArn,
          })
        );

        console.log(`[TeamMeetingService] Attempt ${attempt + 1}/${maxAttempts}: ${status.status}`);

        if (status.status === 'SUCCEEDED') {
          if (!status.output) {
            throw new Error('Execution succeeded but no output returned');
          }
          const result = JSON.parse(status.output);
          console.log('[TeamMeetingService] Team meeting complete');
          return result;
        }

        if (status.status === 'FAILED') {
          console.error('[TeamMeetingService] Execution failed:', status.cause);
          throw new Error(`Team meeting failed: ${status.cause || 'Unknown error'}`);
        }

        if (status.status === 'TIMED_OUT') {
          throw new Error('Team meeting timed out');
        }

        if (status.status === 'ABORTED') {
          throw new Error('Team meeting was aborted');
        }

        // Still running, wait before polling again
        await this.sleep(2000); // 2 seconds

      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        console.warn(`[TeamMeetingService] Polling error (attempt ${attempt + 1}):`, error);
        await this.sleep(2000);
      }
    }

    throw new Error('Polling timeout: Team meeting did not complete in time');
  }

  /**
   * Start a team meeting and wait for results
   * Convenience method that combines start + poll
   */
  async runMeeting(request: TeamMeetingRequest): Promise<TeamMeetingResult> {
    const executionId = await this.startMeeting(request);
    return await this.pollForResult(executionId);
  }

  /**
   * Get execution status without waiting
   */
  async getStatus(executionArn: string): Promise<{
    status: string;
    startDate?: Date;
    stopDate?: Date;
  }> {
    const { SFNClient, DescribeExecutionCommand } = await import('@aws-sdk/client-sfn');
    const sfn = new SFNClient({ region: 'us-east-1' });

    const result = await sfn.send(
      new DescribeExecutionCommand({
        executionArn,
      })
    );

    return {
      status: result.status || 'UNKNOWN',
      startDate: result.startDate,
      stopDate: result.stopDate,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const teamMeetingService = new TeamMeetingService();
