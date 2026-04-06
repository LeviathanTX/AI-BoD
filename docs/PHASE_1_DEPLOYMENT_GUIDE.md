# Phase 1 Deployment Guide
## AI Employee Team Orchestration

> **Status**: Phase 1 Infrastructure Complete ✅  
> **Ready for**: Local testing + AWS deployment

---

## 🎯 What We Built

### Architecture
- **AI Employee Team**: 5 executives (CEO, CTO, CFO, VP Sales, Head of Product)
- **Advisory Board Integration**: Selective consultation of 30+ celebrity advisors
- **Orchestration**: AWS Step Functions state machine
- **Models**: Nova Micro (employees) + Premium models (board)
- **Cost**: $0.018/meeting (internal) or $0.045/meeting (with board)

### Files Created
```
ai-bod/
├── lambdas/
│   ├── ai-employee-caller/       ✅ Core: Calls Bedrock for each AI employee
│   ├── consensus-analyzer/       ✅ CEO decides if board consultation needed
│   ├── board-advisor-caller/     ✅ Calls celebrity advisors (premium models)
│   ├── ceo-synthesizer/          ✅ Final decision with action items
│   ├── employee-selector/        ✅ Determines which employees participate
│   ├── intent-classifier/        ✅ Classifies question type
│   └── memory-updater/           ✅ Stores decisions to memory
│
├── infrastructure/orchestration/
│   └── team-meeting-state-machine.json  ✅ Step Functions definition
│
├── api/v2/
│   └── team-meeting.js           ✅ API endpoint to trigger orchestration
│
├── scripts/
│   └── test-team-meeting-local.js  ✅ Local test without AWS
│
└── docs/
    ├── ORCHESTRATION_ARCHITECTURE.md
    ├── AI_EMPLOYEE_TEAM_ARCHITECTURE.md
    └── PHASE_1_DEPLOYMENT_GUIDE.md  ← You are here
```

---

## 🚀 Quick Start: Local Testing (No AWS Required)

### Prerequisites
```bash
cd ~/Projects/ai-bod

# Install dependencies for each Lambda
cd lambdas/ai-employee-caller && npm install && cd ../..
cd lambdas/consensus-analyzer && npm install && cd ../..
cd lambdas/board-advisor-caller && npm install && cd ../..
cd lambdas/ceo-synthesizer && npm install && cd ../..
```

### Set AWS Credentials
```bash
export AWS_ACCESS_KEY_ID="your_key"
export AWS_SECRET_ACCESS_KEY="your_secret"
export AWS_REGION="us-east-1"
```

### Run Local Test
```bash
node scripts/test-team-meeting-local.js "Should we add enterprise features or focus on SMB?"
```

**What happens**:
1. Calls 5 AI employees in parallel (via Bedrock)
2. CEO analyzes consensus
3. If needed, consults 2-3 board advisors
4. CEO synthesizes final decision with action items

**Expected output**:
```
🚀 Testing AI Employee Team Meeting (Local)
═══════════════════════════════════════════════════════════

📝 QUESTION: Should we add enterprise features or focus on SMB?

═══════════════════════════════════════════════════════════

👥 INTERNAL TEAM MEETING (Parallel Calls)

  🤖 Calling CEO...
  🤖 Calling CTO...
  🤖 Calling CFO...
  🤖 Calling VP_SALES...
  🤖 Calling HEAD_OF_PRODUCT...

✅ Team responses received

═══════════════════════════════════════════════════════════

💬 Alex (CEO):
   This is a classic prioritization challenge...

💬 Morgan (CTO):
   Enterprise means 6 months of work: SSO, RBAC, audit logs...

... (full responses)

═══════════════════════════════════════════════════════════

🎯 CEO ANALYZING CONSENSUS...

📊 Consensus Score: 75%
📋 Rationale: Team leans SMB but CTO flags valid concerns
🎯 Needs Board: YES

... (board consultation + final decision)
```

---

## ☁️ AWS Deployment

### Step 1: Install AWS CLI & Configure

```bash
# Install AWS CLI (if not installed)
brew install awscli

# Configure credentials
aws configure
# AWS Access Key ID: [your key]
# AWS Secret Access Key: [your secret]
# Default region: us-east-1
# Default output format: json
```

### Step 2: Create IAM Role for Step Functions

```bash
# Create trust policy
cat > /tmp/stepfunctions-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Service": "states.amazonaws.com"
    },
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create role
aws iam create-role \
  --role-name AIBoDStepFunctionsRole \
  --assume-role-policy-document file:///tmp/stepfunctions-trust-policy.json

# Attach Lambda invoke policy
aws iam attach-role-policy \
  --role-name AIBoDStepFunctionsRole \
  --policy-arn arn:aws:iam::aws:policy/AWSLambdaRole
```

### Step 3: Create IAM Role for Lambda Functions

```bash
# Create Lambda trust policy
cat > /tmp/lambda-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Service": "lambda.amazonaws.com"
    },
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create role
aws iam create-role \
  --role-name AIBoDLambdaRole \
  --assume-role-policy-document file:///tmp/lambda-trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name AIBoDLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create inline policy for Bedrock access
cat > /tmp/bedrock-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "bedrock:InvokeModel",
      "bedrock:InvokeModelWithResponseStream"
    ],
    "Resource": "*"
  }]
}
EOF

aws iam put-role-policy \
  --role-name AIBoDLambdaRole \
  --policy-name BedrockAccess \
  --policy-document file:///tmp/bedrock-policy.json
```

### Step 4: Deploy Lambda Functions

```bash
cd ~/Projects/ai-bod

# Get Lambda role ARN
LAMBDA_ROLE_ARN=$(aws iam get-role --role-name AIBoDLambdaRole --query 'Role.Arn' --output text)

# Deploy each Lambda function
for lambda_dir in lambdas/*/; do
  lambda_name=$(basename "$lambda_dir")
  
  echo "📦 Deploying $lambda_name..."
  
  cd "$lambda_dir"
  
  # Install dependencies
  npm install --production
  
  # Create deployment package
  zip -r function.zip . -x "*.git*" -x "node_modules/.cache/*"
  
  # Create or update Lambda
  aws lambda create-function \
    --function-name "aibot-$lambda_name" \
    --runtime nodejs20.x \
    --role "$LAMBDA_ROLE_ARN" \
    --handler index.handler \
    --zip-file fileb://function.zip \
    --timeout 120 \
    --memory-size 512 \
    --environment "Variables={AWS_REGION=us-east-1}" \
    2>/dev/null || \
  aws lambda update-function-code \
    --function-name "aibot-$lambda_name" \
    --zip-file fileb://function.zip
  
  rm function.zip
  cd ../..
done

echo "✅ All Lambda functions deployed!"
```

### Step 5: Deploy Step Functions State Machine

```bash
# Get Step Functions role ARN
SFN_ROLE_ARN=$(aws iam get-role --role-name AIBoDStepFunctionsRole --query 'Role.Arn' --output text)

# Get Lambda ARNs
AI_EMPLOYEE_ARN=$(aws lambda get-function --function-name aibot-ai-employee-caller --query 'Configuration.FunctionArn' --output text)
CONSENSUS_ARN=$(aws lambda get-function --function-name aibot-consensus-analyzer --query 'Configuration.FunctionArn' --output text)
BOARD_ADVISOR_ARN=$(aws lambda get-function --function-name aibot-board-advisor-caller --query 'Configuration.FunctionArn' --output text)
CEO_SYNTHESIZER_ARN=$(aws lambda get-function --function-name aibot-ceo-synthesizer --query 'Configuration.FunctionArn' --output text)
EMPLOYEE_SELECTOR_ARN=$(aws lambda get-function --function-name aibot-employee-selector --query 'Configuration.FunctionArn' --output text)
MEMORY_UPDATER_ARN=$(aws lambda get-function --function-name aibot-memory-updater --query 'Configuration.FunctionArn' --output text)

# Replace placeholders in state machine JSON
sed -e "s|\${AIEmployeeCallerFunctionArn}|$AI_EMPLOYEE_ARN|g" \
    -e "s|\${ConsensusAnalyzerFunctionArn}|$CONSENSUS_ARN|g" \
    -e "s|\${BoardAdvisorCallerFunctionArn}|$BOARD_ADVISOR_ARN|g" \
    -e "s|\${CEOSynthesizerFunctionArn}|$CEO_SYNTHESIZER_ARN|g" \
    -e "s|\${EmployeeSelectorFunctionArn}|$EMPLOYEE_SELECTOR_ARN|g" \
    -e "s|\${MemoryUpdaterFunctionArn}|$MEMORY_UPDATER_ARN|g" \
    infrastructure/orchestration/team-meeting-state-machine.json > /tmp/state-machine-final.json

# Create state machine
aws stepfunctions create-state-machine \
  --name "AI-Employee-Team-Meeting" \
  --definition file:///tmp/state-machine-final.json \
  --role-arn "$SFN_ROLE_ARN"

echo "✅ Step Functions state machine deployed!"

# Get state machine ARN
STATE_MACHINE_ARN=$(aws stepfunctions list-state-machines --query "stateMachines[?name=='AI-Employee-Team-Meeting'].stateMachineArn" --output text)

echo "State Machine ARN: $STATE_MACHINE_ARN"
echo "Add this to Vercel environment variables as TEAM_MEETING_STATE_MACHINE_ARN"
```

### Step 6: Test AWS Deployment

```bash
# Start execution
aws stepfunctions start-execution \
  --state-machine-arn "$STATE_MACHINE_ARN" \
  --name "test-$(date +%s)" \
  --input '{
    "question": "Should we add enterprise features or focus on SMB?",
    "userId": "test-user-123",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'

# Monitor execution (get executionArn from output above)
aws stepfunctions describe-execution \
  --execution-arn "arn:aws:states:us-east-1:ACCOUNT:execution:AI-Employee-Team-Meeting:test-XXXXX"

# Get results
aws stepfunctions get-execution-history \
  --execution-arn "arn:aws:states:us-east-1:ACCOUNT:execution:AI-Employee-Team-Meeting:test-XXXXX" \
  --max-items 100
```

---

## 🔗 Vercel Integration

### Step 1: Add Environment Variables

```bash
# In Vercel dashboard or via CLI:
vercel env add TEAM_MEETING_STATE_MACHINE_ARN production
# Paste: arn:aws:states:us-east-1:ACCOUNT:stateMachine:AI-Employee-Team-Meeting

vercel env add AWS_ACCESS_KEY_ID production
# Paste: your AWS access key

vercel env add AWS_SECRET_ACCESS_KEY production
# Paste: your AWS secret key

vercel env add AWS_REGION production
# Paste: us-east-1
```

### Step 2: Deploy to Vercel

```bash
cd ~/Projects/ai-bod

# Deploy
vercel --prod

# Set alias
vercel alias set <deployment-url> ai-bod.vercel.app
```

### Step 3: Test Production API

```bash
curl -X POST https://ai-bod.vercel.app/api/v2/team-meeting \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Should we add enterprise features or focus on SMB?",
    "userId": "test-user-123",
    "poll": true
  }'
```

---

## 📊 Cost Analysis

### Per Team Meeting

**Internal Team Only (80% of meetings)**:
```
Intent classification (Nova Micro):       $0.0001
Employee selection logic (Nova Micro):    $0.0002
AI Employee calls (5 × Nova Micro):       $0.0075
CEO Consensus Analysis (Nova Pro):        $0.0040
CEO Final Synthesis (Nova Pro):           $0.0040
Memory Update:                            $0.0010
──────────────────────────────────────────────
TOTAL:                                    $0.0168
```

**With Board Consultation (20% of meetings)**:
```
Internal team (above):                    $0.0168
Board advisor calls (3 × premium):        $0.0230
  - Jason (Mistral Large):                $0.0050
  - Reed (Claude Sonnet):                 $0.0150
  - Cheryl (Nova Pro):                    $0.0030
──────────────────────────────────────────────
TOTAL:                                    $0.0398
```

**Blended Average**:
```
(0.80 × $0.0168) + (0.20 × $0.0398) = $0.0214/meeting
```

**At Scale**:
- 1,000 users × 15 meetings/month = 15,000 meetings
- Cost: $321/month

---

## ✅ Phase 1 Complete Checklist

### Infrastructure
- [x] 7 Lambda functions created
- [x] Step Functions state machine defined
- [x] API endpoint created
- [x] Local test script working
- [x] Deployment scripts ready

### Documentation
- [x] Architecture design (AI_EMPLOYEE_TEAM_ARCHITECTURE.md)
- [x] Deployment guide (this file)
- [x] Code comments in all Lambdas

### Testing
- [x] Local test (no AWS) working
- [ ] AWS deployment tested
- [ ] Vercel integration tested
- [ ] End-to-end production test

---

## 🚧 Next Steps: Phase 2

1. **Memory System**: OpenSearch Serverless + embeddings
2. **UI Components**: Board Meeting view in React
3. **Production Workflows**: Weekly reviews, auto-analysis
4. **Outcome Tracking**: Did user follow advice? Learn over time

---

## 🐛 Troubleshooting

### Lambda timeout errors
- Increase timeout: `aws lambda update-function-configuration --function-name aibot-xxx --timeout 180`

### Bedrock InvokeModel errors
- Check model IDs are correct for us-east-1
- Verify IAM role has bedrock:InvokeModel permission
- Check AWS quotas: https://console.aws.amazon.com/servicequotas/

### Step Functions execution fails
- Check CloudWatch Logs for each Lambda
- Verify all Lambda ARNs in state machine JSON
- Check IAM role trust relationships

### API endpoint 502 errors
- Check Vercel environment variables set
- Verify State Machine ARN is correct
- Check AWS credentials have StepFunctions:StartExecution permission

---

**Ready to test?** Run `node scripts/test-team-meeting-local.js` 🚀
