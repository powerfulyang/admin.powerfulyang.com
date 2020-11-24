describe('test reg', () => {
  it('match', () => {
    const firstLine = 'test the line wrap\n 我们'.split('\n')[0];
    expect(firstLine).toBe('test the line wrap');
  });
});
