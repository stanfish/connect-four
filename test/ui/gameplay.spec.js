import chai from 'chai';
import { expect, Assertion } from 'chai';
import chaiDom from 'chai-dom';
chai.use(chaiDom);
import m from 'mithril';
import { _before, _beforeEach, _afterEach } from './fixtures.js';
import { qs, qsa } from './utils.js';
import { onPendingChipTransitionEnd, triggerMouseEvent } from './utils.js';

describe('game UI', function () {

  before(_before);
  beforeEach(_beforeEach);
  afterEach(_afterEach);

  // Add syntactic sugar assertion for testing CSS translate values
  Assertion.addMethod('translate', function (expectedX, expectedY) {
    let translate = this._obj.style.transform;
    let actualX = parseFloat(translate.slice(translate.indexOf('(') + 1));
    let actualY = parseFloat(translate.slice(translate.indexOf(',') + 1));
    this.assert(
      actualX === expectedX && actualY === expectedY,
      'expected #{this} to have translate #{exp} but got #{act}',
      'expected #{this} not to have translate #{exp}',
      '(' + [expectedX, expectedY].join(', ') + ')',
      '(' + [actualX, actualY].join(', ') + ')'
    );
  });

  it('should place chip in initial column', function (done) {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(0, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 0, 0);
  });

  it('should align chip to clicked column', function (done) {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 0);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);

  });

  it('should place chip after aligning', function (done) {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 0);
        triggerMouseEvent(grid, 'click', 192, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  it('should signal AI to place chip on its turn', function (done) {
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    // Human's turn
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 0);
        triggerMouseEvent(grid, 'click', 192, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 384);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        // AI's turn
        expect(pendingChip).to.have.class('black');
        expect(pendingChip).to.have.translate(128, 0);
        return onPendingChipTransitionEnd();
      })
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(128, 384);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'click', 192, 0);
  });

  it('should align chip to hovered column', function (done) {
    qsa('#game-dashboard button')[1].click();
    m.redraw.sync();
    qsa('#game-dashboard button')[0].click();
    m.redraw.sync();
    let grid = qs('#grid');
    onPendingChipTransitionEnd()
      .then(function (pendingChip) {
        expect(pendingChip).to.have.translate(192, 0);
        done();
      })
      .catch(done);
    triggerMouseEvent(grid, 'mousemove', 192, 0);
  });

});
