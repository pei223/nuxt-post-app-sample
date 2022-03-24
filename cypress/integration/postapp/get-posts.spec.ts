describe('get posts page', () => {
  it('check first row values', () => {
    cy.visit('http://localhost:3000/posts?page=1')
    const firstRow = cy.get('.post-row').first()
    firstRow.get('.post-title').should((el) => {
      expect('testtest').equal(el.text().trim().replace('\n', ''))
    })
    firstRow.get('.post-author').should((el) => {
      expect('testname1').equal(el.text().trim().replace('\n', ''))
    })
    cy.screenshot('getposts', { overwrite: true })
  })
})
