import { SeverityStatusPipe } from './severity-status.pipe';

describe('SeverityStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new SeverityStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
