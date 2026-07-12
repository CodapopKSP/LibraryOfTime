//|------------------------|
//|     Politics Tests     |
//|------------------------|

// Tests for the Politics category

function runPresidentialTermTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedTerm] of testCases) {
        testCount++;

        const testedDate = parseInputDate(inputDate, timezone);
        const actualTerm = getCurrentPresidentialTerm(testedDate).toFixed(6);
        if (actualTerm !== expectedTerm) {
            console.error(`Presidential Term: Test ${testCount} failed.`);
            console.error('Expected:', expectedTerm);
            console.error('Received:', actualTerm);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

// Terms advance every 4 years at noon on January 20th, UTC-04:00, from the 1789 epoch.
function testPresidentialTerm() {
    return runPresidentialTermTests([
        ["1789-1-20, 12:00:00", "UTC-04:00", "0.000000"],   // exact epoch
        ["2021-1-20, 12:00:00", "UTC-04:00", "58.000000"],  // exact inauguration instant
        ["2025-1-20, 12:00:00", "UTC-04:00", "59.000000"],
        ["2025-1-1, 00:00:00", "UTC+00:00", "58.986539"],   // year boundary: 58 + (1441+1/3)/1461
    ]);
}

// Run all tests.
function runPoliticsTests() {
    const testFunctions = [
        testPresidentialTerm,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Politics: All Tests Passed.');
    }
}
