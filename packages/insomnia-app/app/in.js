class In {
  constructor() {
    this.tests = [];
    this.testsLen = 0;
    this.testId = 0;
  }

  newTest(value, expectedVal, title = 'Teste ' + this.testId, message = null) {
    let result = false;
    let text;

    if (value === expectedVal) {
      result = true;
      message = 'test OK';
    }

    if (!result && message === null) {
      message = 'Expected ' + expectedVal + '. But got ' + value;
    }

    text = message.replace(/{value}/g, value).replace(/{expected}/g, expectedVal);
    this.tests.push({ title, value, expectedVal, text, result });
    this.len++;
    this.testId++;
  }

  getTests() {
    return this.tests;
  }

  testsLen() {
    return this.testsLen;
  }
}

export default In;
