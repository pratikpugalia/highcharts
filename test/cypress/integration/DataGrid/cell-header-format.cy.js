describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/data-grid/basic/cells-formatting');
    });

    it('Headers should be formatted.', () => {
        cy.get('.highcharts-datagrid-column-header').eq(0).should('have.text', 'product name');
        cy.get('.highcharts-datagrid-column-header').eq(1).should('have.text', 'weight (kg)');
        cy.get('.highcharts-datagrid-column-header').eq(2).should('have.text', '($) price');
    });

    it('Cells should be formatted.', () => {
        cy.get('.highcharts-datagrid-cell').eq(0).should('have.text', 'Apples No. 1');
        cy.get('.highcharts-datagrid-cell').eq(1).should('have.text', '100 kg');
        cy.get('.highcharts-datagrid-cell').eq(2).should('have.text', '1.5 $');
    });

    it('The cell containing text should lose format when editing and gain back when not.', () => {
        cy.get('.highcharts-datagrid-cell').eq(3).click();
        cy.get('.highcharts-datagrid-cell-input').should('have.value', 'Pears');
        cy.get('.highcharts-datagrid-cell-input').type(' from the tree');
        cy.get('body').click();
        cy.get('.highcharts-datagrid-cell').eq(3).should('have.text', 'Pears from the tree No. 1');
    });

    it('The cell containing number should lose format when editing and gain back when not.', () => {
        cy.get('.highcharts-datagrid-cell').eq(4).click();
        cy.get('.highcharts-datagrid-cell-input').should('have.value', '40');
        cy.get('.highcharts-datagrid-cell-input').clear().type('300');
        cy.get('body').click();
        cy.get('.highcharts-datagrid-cell').eq(4).should('have.text', '300 kg');
    });
});
