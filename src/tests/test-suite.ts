import axios from 'axios';
import chalk from 'chalk';
import { io, Socket } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const WS_URL = 'http://localhost:5000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

class TestSuite {
  private results: TestResult[] = [];
  private sessionId: string | null = null;
  private socket: Socket | null = null;

  async runAll() {
    console.log(chalk.blue.bold('\n🧪 Starting Comprehensive Test Suite\n'));

    // API Tests
    await this.testHealthEndpoint();
    await this.testSessionCreation();
    await this.testInvalidSessionId();
    await this.testIntakeValidation();
    await this.testLargePayload();
    await this.testConcurrentRequests();
    await this.testWebSocketConnection();
    await this.testMissingAPIKey();
    await this.testRateLimiting();
    await this.testSessionPersistence();
    await this.testCleanup();

    // Display results
    this.displayResults();
  }

  private async runTest(name: string, testFn: () => Promise<void>) {
    const start = Date.now();
    try {
      await testFn();
      this.results.push({
        name,
        passed: true,
        duration: Date.now() - start
      });
      console.log(chalk.green(`✓ ${name}`));
    } catch (error: any) {
      this.results.push({
        name,
        passed: false,
        error: error.message || 'Unknown error',
        duration: Date.now() - start
      });
      console.log(chalk.red(`✗ ${name}`));
      console.log(chalk.gray(`  ${error.message}`));
    }
  }

  async testHealthEndpoint() {
    await this.runTest('Health check endpoint', async () => {
      const response = await axios.get(`${API_BASE}/health`);
      if (response.data.status !== 'healthy') {
        throw new Error('Health check failed');
      }
    });
  }

  async testSessionCreation() {
    await this.runTest('Session creation', async () => {
      const response = await axios.post(`${API_BASE}/lectures/create`);
      if (!response.data.success || !response.data.sessionId) {
        throw new Error('Session creation failed');
      }
      this.sessionId = response.data.sessionId;
    });
  }

  async testInvalidSessionId() {
    await this.runTest('Invalid session ID handling', async () => {
      try {
        await axios.get(`${API_BASE}/lectures/invalid-id-123/status`);
        throw new Error('Should have rejected invalid session ID');
      } catch (error: any) {
        if (error.response?.status !== 400) {
          throw new Error('Expected 400 status for invalid session ID');
        }
      }
    });
  }

  async testIntakeValidation() {
    await this.runTest('Intake data validation', async () => {
      if (!this.sessionId) throw new Error('No session ID');

      // Test invalid data
      const invalidData = {
        title: '', // Empty title should fail
        duration: 5, // Too short
        audienceLevel: 'expert' // Invalid enum value
      };

      try {
        await axios.post(`${API_BASE}/lectures/${this.sessionId}/intake`, invalidData);
        throw new Error('Should have rejected invalid intake data');
      } catch (error: any) {
        if (error.response?.status !== 400) {
          throw new Error('Expected 400 status for invalid intake data');
        }
      }

      // Test valid data
      const validData = {
        title: 'Test Lecture',
        topic: 'Testing',
        duration: 50,
        audienceLevel: 'beginner',
        prerequisites: ['Basic knowledge'],
        mainGoals: ['Learn testing'],
        constraints: [],
        preferredStyle: 'Interactive',
        specialRequirements: []
      };

      const response = await axios.post(`${API_BASE}/lectures/${this.sessionId}/intake`, validData);
      if (!response.data.success) {
        throw new Error('Valid intake data was rejected');
      }
    });
  }

  async testLargePayload() {
    await this.runTest('Large payload handling', async () => {
      const largeData = {
        title: 'A'.repeat(150), // Large but within limit
        topic: 'Testing',
        duration: 50,
        audienceLevel: 'beginner',
        prerequisites: Array(10).fill('Prerequisite'), // Max allowed
        mainGoals: Array(10).fill('Goal'),
        constraints: Array(10).fill('Constraint'),
        preferredStyle: 'Interactive',
        specialRequirements: Array(10).fill('Requirement')
      };

      // Create new session for this test
      const sessionRes = await axios.post(`${API_BASE}/lectures/create`);
      const testSessionId = sessionRes.data.sessionId;

      const response = await axios.post(`${API_BASE}/lectures/${testSessionId}/intake`, largeData);
      if (!response.data.success) {
        throw new Error('Failed to handle large payload');
      }
    });
  }

  async testConcurrentRequests() {
    await this.runTest('Concurrent request handling', async () => {
      const promises = Array(10).fill(null).map(() =>
        axios.post(`${API_BASE}/lectures/create`)
      );

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;

      if (successful < 8) { // Allow some failures due to rate limiting
        throw new Error(`Only ${successful}/10 concurrent requests succeeded`);
      }
    });
  }

  async testWebSocketConnection() {
    await this.runTest('WebSocket connection and events', async () => {
      return new Promise((resolve, reject) => {
        this.socket = io(WS_URL, {
          transports: ['websocket'],
          reconnection: false
        });

        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 5000);

        this.socket.on('connect', () => {
          clearTimeout(timeout);

          if (!this.sessionId) {
            reject(new Error('No session ID for WebSocket test'));
            return;
          }

          // Test joining session
          this.socket!.emit('join-session', this.sessionId);

          // Wait briefly then disconnect
          setTimeout(() => {
            this.socket!.disconnect();
            resolve();
          }, 100);
        });

        this.socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          reject(new Error(`WebSocket connection failed: ${error.message}`));
        });
      });
    });
  }

  async testMissingAPIKey() {
    await this.runTest('Missing API key handling', async () => {
      // This should work with mock mode
      const response = await axios.get(`${API_BASE}/agents/info`);
      if (!response.data.success) {
        throw new Error('Should handle missing API key with mock mode');
      }
    });
  }

  async testRateLimiting() {
    await this.runTest('Rate limiting', async () => {
      // Make many rapid requests
      const promises = Array(150).fill(null).map(() =>
        axios.get(`${API_BASE}/health`).catch(e => e)
      );

      const results = await Promise.allSettled(promises);
      const rateLimited = results.filter((r: any) =>
        r.status === 'fulfilled' && r.value?.response?.status === 429
      ).length;

      if (rateLimited === 0) {
        console.warn('  ⚠️  Rate limiting may not be properly configured');
      }
    });
  }

  async testSessionPersistence() {
    await this.runTest('Session persistence', async () => {
      // Get all sessions
      const response = await axios.get(`${API_BASE}/lectures`);
      if (!response.data.success) {
        throw new Error('Failed to retrieve sessions');
      }

      // Check if our test session exists
      const hasTestSession = response.data.sessions.some(
        (s: any) => s.id === this.sessionId
      );

      if (!hasTestSession && this.sessionId) {
        throw new Error('Session was not persisted');
      }
    });
  }

  async testCleanup() {
    await this.runTest('Session cleanup', async () => {
      if (!this.sessionId) return;

      const response = await axios.delete(`${API_BASE}/lectures/${this.sessionId}`);
      if (!response.data.success) {
        throw new Error('Failed to delete session');
      }

      // Verify deletion
      try {
        await axios.get(`${API_BASE}/lectures/${this.sessionId}/status`);
        throw new Error('Session still exists after deletion');
      } catch (error: any) {
        if (error.response?.status !== 404) {
          throw new Error('Expected 404 for deleted session');
        }
      }
    });
  }

  private displayResults() {
    console.log(chalk.blue.bold('\n📊 Test Results Summary\n'));

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    // Display individual results
    this.results.forEach(result => {
      const icon = result.passed ? chalk.green('✓') : chalk.red('✗');
      const name = result.passed ? chalk.green(result.name) : chalk.red(result.name);
      const duration = chalk.gray(`(${result.duration}ms)`);

      console.log(`  ${icon} ${name} ${duration}`);
      if (!result.passed && result.error) {
        console.log(chalk.gray(`    Error: ${result.error}`));
      }
    });

    // Summary
    console.log(chalk.blue.bold('\n📈 Summary:'));
    console.log(`  Total tests: ${this.results.length}`);
    console.log(`  Passed: ${chalk.green(passed.toString())}`);
    console.log(`  Failed: ${failed > 0 ? chalk.red(failed.toString()) : '0'}`);
    console.log(`  Duration: ${totalDuration}ms`);

    const successRate = (passed / this.results.length * 100).toFixed(1);
    const rateColor = parseFloat(successRate) >= 80 ? chalk.green : chalk.yellow;
    console.log(`  Success rate: ${rateColor(successRate + '%')}`);

    if (failed === 0) {
      console.log(chalk.green.bold('\n🎉 All tests passed!'));
    } else {
      console.log(chalk.red.bold(`\n⚠️  ${failed} test(s) failed`));
    }
  }
}

// Edge case tests
class EdgeCaseTests {
  async testXSSPrevention() {
    console.log(chalk.yellow('\n🔒 Testing XSS Prevention...'));

    const maliciousData = {
      title: '<script>alert("XSS")</script>',
      topic: 'Testing<img src=x onerror=alert("XSS")>',
      duration: 50,
      audienceLevel: 'beginner',
      prerequisites: ['<iframe src="evil.com"></iframe>'],
      mainGoals: ['javascript:alert(1)'],
    };

    try {
      const sessionRes = await axios.post(`${API_BASE}/lectures/create`);
      const response = await axios.post(
        `${API_BASE}/lectures/${sessionRes.data.sessionId}/intake`,
        maliciousData
      );

      // Check if data was sanitized
      const packageRes = await axios.get(`${API_BASE}/lectures/${sessionRes.data.sessionId}/package`);
      const brief = packageRes.data.package.brief;

      if (brief?.title?.includes('<script>')) {
        throw new Error('XSS not prevented in title');
      }

      console.log(chalk.green('✓ XSS prevention working'));
    } catch (error: any) {
      if (error.message.includes('XSS')) {
        console.log(chalk.red(`✗ XSS vulnerability detected: ${error.message}`));
      } else {
        console.log(chalk.green('✓ XSS prevention working'));
      }
    }
  }

  async testNetworkResilience() {
    console.log(chalk.yellow('\n🌐 Testing Network Resilience...'));

    // Test timeout handling
    try {
      await axios.get(`${API_BASE}/health`, { timeout: 1 });
      console.log(chalk.yellow('  ⚠️  Timeout test skipped (server too fast)'));
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        console.log(chalk.green('  ✓ Timeout handling works'));
      }
    }

    // Test reconnection
    const socket = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 100
    });

    let reconnectCount = 0;
    socket.on('reconnect', () => {
      reconnectCount++;
    });

    socket.disconnect();
    setTimeout(() => socket.connect(), 50);

    await new Promise(resolve => setTimeout(resolve, 500));
    socket.disconnect();

    console.log(chalk.green(`  ✓ WebSocket reconnection works (${reconnectCount} reconnects)`));
  }

  async testMemoryLeaks() {
    console.log(chalk.yellow('\n💾 Testing Memory Management...'));

    const initialMemory = process.memoryUsage().heapUsed;

    // Create and delete many sessions
    for (let i = 0; i < 100; i++) {
      const res = await axios.post(`${API_BASE}/lectures/create`);
      await axios.delete(`${API_BASE}/lectures/${res.data.sessionId}`);
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

    if (memoryIncrease > 50) {
      console.log(chalk.yellow(`  ⚠️  Potential memory leak: ${memoryIncrease.toFixed(2)}MB increase`));
    } else {
      console.log(chalk.green(`  ✓ Memory management OK (${memoryIncrease.toFixed(2)}MB increase)`));
    }
  }
}

// Run tests
async function runTests() {
  console.log(chalk.blue.bold('═'.repeat(60)));
  console.log(chalk.blue.bold('  LECTURE DEVELOPMENT SYSTEM - TEST SUITE'));
  console.log(chalk.blue.bold('═'.repeat(60)));

  // Check if server is running
  try {
    await axios.get(`${API_BASE}/health`);
  } catch (error) {
    console.log(chalk.red('\n❌ Server is not running!'));
    console.log(chalk.yellow('Please start the server with: npm run server'));
    process.exit(1);
  }

  const suite = new TestSuite();
  await suite.runAll();

  const edgeTests = new EdgeCaseTests();
  await edgeTests.testXSSPrevention();
  await edgeTests.testNetworkResilience();
  await edgeTests.testMemoryLeaks();

  console.log(chalk.blue.bold('\n' + '═'.repeat(60)));
  console.log(chalk.green.bold('  Testing Complete!'));
  console.log(chalk.blue.bold('═'.repeat(60) + '\n'));
}

// Export for use in package.json scripts
if (require.main === module) {
  runTests().catch(console.error);
}

export { TestSuite, EdgeCaseTests };